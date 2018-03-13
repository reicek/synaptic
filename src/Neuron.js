'use strict';

import Connection, {connections} from './Connection';

let neurons = 0;

// squashing functions
const squash = {
// eq. 5 & 5'
  LOGISTIC: function (x, derivate) {
    if (!derivate)
      return 1 / (1 + Math.exp(-x));
    else
      return 1 / (1 + Math.exp(-x)) * (1 - 1 / (1 + Math.exp(-x)));
  },

  TANH: function (x, derivate) {
    if (derivate)
      return 1 - Math.pow(Math.tanh(x), 2);
    else
      return Math.tanh(x);
  },

  IDENTITY: function (x, derivate) {
    return derivate ? 1 : x;
  },

  HLIM: function (x, derivate) {
    return derivate ? 1 : x > 0 ? 1 : 0;
  },

  RELU: function (x, derivate) {
    if (derivate)
      return x > 0 ? 1 : 0;
    else
      return x > 0 ? x : 0;
  }
};


export default class Neuron {
  constructor() {
    this.ID = Neuron.uid();

    this.connections = {
      inputs: {},
      projected: {},
      gated: {}
    };

    this.error = {
      responsibility: 0,
      projected: 0,
      gated: 0
    };

    this.trace = {
      elegibility: {},
      extended: {},
      influences: {}
    };

    this.state = 0;
    this.old = 0;
    this.activation = 0;
    this.selfconnection = new Connection(this, this, 0); // weight = 0 -> not connected
    this.squash = Neuron.squash.LOGISTIC;
    this.neighboors = {};
    this.bias = Math.random() * .2 - .1;
  }

  static squash = squash;

  // activate the neuron
  activate(input) {
    // activation from enviroment (for input neurons)
    if (typeof input != 'undefined') {
      this.activation = input;
      this.derivative = 0;
      this.bias = 0;

      return this.activation;
    }

// old state
    this.old = this.state;

// eq. 15
    this.state = this.selfconnection.gain * this.selfconnection.weight *
      this.state + this.bias;

    for (this._i in this.connections.inputs) {
      this._input = this.connections.inputs[this._i];
      this.state += this._input.from.activation * this._input.weight * this._input.gain;
    }

// eq. 16
    this.activation = this.squash(this.state);

// f'(s)
    this.derivative = this.squash(this.state, true);

// update traces
    this._influences = [];
    for (this._id in this.trace.extended) {
      // extended elegibility trace
      this._neuron = this.neighboors[this._id];

      // if gated neuron's selfconnection is gated by this unit, the influence keeps track of the neuron's old state
      this._influence = this._neuron.selfconnection.gater == this ? this._neuron.old : 0;

      // index runs over all the incoming connections to the gated neuron that are gated by this unit
      for (this._incoming in this.trace.influences[this._neuron.ID]) { // captures the effect that has an input connection to this unit, on a neuron that is gated by this unit
        this._influence += this.trace.influences[this._neuron.ID][this._incoming].weight * this.trace.influences[this._neuron.ID][this._incoming].from.activation;
      }

      this._influences[this._neuron.ID] = this._influence;
    }

    for (this._i in this.connections.inputs) {
      this._input = this.connections.inputs[this._i];

      // elegibility trace - Eq. 17
      this.trace.elegibility[this._input.ID] = this.selfconnection.gain * this.selfconnection.weight * this.trace.elegibility[this._input.ID] + this._input.gain * this._input.from.activation;

      for (this._id in this.trace.extended) {
        // extended elegibility trace
        this._xtrace = this.trace.extended[this._id];
        this._neuron = this.neighboors[this._id];
        this._influence = this._influences[this._neuron.ID];

        // eq. 18
        this._xtrace[this._input.ID] = this._neuron.selfconnection.gain * this._neuron.selfconnection.weight * this._xtrace[this._input.ID] + this.derivative * this.trace.elegibility[this._input.ID] * this._influence;
      }
    }

//  update gated connection's gains
    for (this._connection in this.connections.gated) {
      this.connections.gated[this._connection].gain = this.activation;
    }

    return this.activation;
  }

// back-propagate the error
  propagate(rate, target) {
    // error accumulator
    this._errorCount = 0;

    // output neurons get their error from the enviroment
    if (typeof target != 'undefined') // whether or not this neuron is in the output layer
      this.error.responsibility = this.error.projected = target - this.activation; // Eq. 10
    else { // the rest of the neuron compute their error responsibilities by backpropagation
      // error responsibilities from all the connections projected from this neuron
      for (this._id in this.connections.projected) {
        this._connection = this.connections.projected[this._id];
        this._neuron = this._connection.to;
        // Eq. 21
        this._errorCount += this._neuron.error.responsibility * this._connection.gain * this._connection.weight;
      }

      // projected error responsibility
      this.error.projected = this.derivative * this._errorCount;

      this._errorCount = 0;
      // error responsibilities from all the connections gated by this neuron
      for (this._id in this.trace.extended) {
        this._neuron = this.neighboors[this._id]; // gated neuron
        this._influence = this._neuron.selfconnection.gater == this ? this._neuron.old : 0; // if gated neuron's selfconnection is gated by this neuron

        // index runs over all the connections to the gated neuron that are gated by this neuron
        for (this._input in this.trace.influences[this._id]) { // captures the effect that the input connection of this neuron have, on a neuron which its input/s is/are gated by this neuron
          this._influence += this.trace.influences[this._id][this._input].weight * this.trace.influences[
            this._neuron.ID][this._input].from.activation;
        }
        // eq. 22
        this._errorCount += this._neuron.error.responsibility * this._influence;
      }

      // gated error responsibility
      this.error.gated = this.derivative * this._errorCount;

      // error responsibility - Eq. 23
      this.error.responsibility = this.error.projected + this.error.gated;
    }

    // learning rate
    rate = rate || .1;

    // adjust all the neuron's incoming connections
    for (this._id in this.connections.inputs) {
      this._input = this.connections.inputs[this._id];

      // Eq. 24
      this._gradient = this.error.projected * this.trace.elegibility[this._input.ID];
      for (this._i in this.trace.extended) {
        this._neuron = this.neighboors[this._i];
        this._gradient += this._neuron.error.responsibility * this.trace.extended[this._neuron.ID][this._input.ID];
      }
      this._input.weight += rate * this._gradient; // adjust weights - aka learn
    }

    // adjust bias
    this.bias += rate * this.error.responsibility;
  }

  project(neuron, weight) {
    // self-connection
    if (neuron == this) {
      this.selfconnection.weight = 1;
      return this.selfconnection;
    }

    // check if connection already exists
    this._connected = this.connected(neuron);
    if (this._connected && this._connected.type == 'projected') {
      // update connection
      if (typeof weight != 'undefined')
        this._connected.connection.weight = weight;
      // return existing connection
      return this._connected.connection;
    } else {
      // create a new connection
      this._connection = new Connection(this, neuron, weight);
    }

    // reference all the connections and traces
    this.connections.projected[this._connection.ID] = this._connection;
    this.neighboors[neuron.ID] = neuron;
    neuron.connections.inputs[this._connection.ID] = this._connection;
    neuron.trace.elegibility[this._connection.ID] = 0;

    for (this._id in neuron.trace.extended) {
      this._trace = neuron.trace.extended[this._id];
      this._trace[this._connection.ID] = 0;
    }

    return this._connection;
  }

  gate(connection) {
    // add connection to gated list
    this.connections.gated[connection.ID] = connection;

    this._neuron = connection.to;
    if (!(this._neuron.ID in this.trace.extended)) {
      // extended trace
      this.neighboors[this._neuron.ID] = this._neuron;
      this._xtrace = this.trace.extended[this._neuron.ID] = {};

      for (this._id in this.connections.inputs) {
        this._input = this.connections.inputs[this._id];
        this._xtrace[this._input.ID] = 0;
      }
    }

    // keep track
    if (this._neuron.ID in this.trace.influences)
      this.trace.influences[this._neuron.ID].push(connection);
    else
      this.trace.influences[this._neuron.ID] = [connection];

    // set gater
    connection.gater = this;
  }

// returns true or false whether the neuron is self-connected or not
  selfconnected() {
    return this.selfconnection.weight !== 0;
  }

// returns true or false whether the neuron is connected to another neuron (parameter)
  connected(neuron) {
    this._result = {
      type: null,
      connection: false
    };

    if (this == neuron) {
      if (this.selfconnected()) {
        this._result.type = 'selfconnection';
        this._result.connection = this.selfconnection;

        return this._result;

      } else

        return false;
    }

    for (this._type in this.connections) {
      for (this._i in this.connections[this._type]) {
        this._connection = this.connections[this._type][this._i];

        switch (true) {
          case (this._connection.to == neuron) :
            this._result.type = this._type;
            this._result.connection = this._connection;

            return this._result;

          case (this._connection.from == neuron) :
            this._result.type = this._type;
            this._result.connection = this._connection;

            return this._result;
        }
      }
    }

    return false;
  }

// clears all the traces (the neuron forgets it's context, but the connections remain intact)
  clear() {
    for (this._trace in this.trace.elegibility) {
      this.trace.elegibility[this._trace] = 0;
    }

    for (this._trace in this.trace.extended) {
      for (this._extended in this.trace.extended[this._trace]) {
        this.trace.extended[this._trace][this._extended] = 0;
      }
    }

    this.error.responsibility = this.error.projected = this.error.gated = 0;
  }

// all the connections are randomized and the traces are cleared
  reset() {
    this.clear();

    for (this._type in this.connections) {
      for (this._connection in this.connections[this._type]) {
        this.connections[this._type][this._connection].weight = Math.random() * .2 - .1;
      }
    }

    this.bias = Math.random() * .2 - .1;
    this.old = this.state = this.activation = 0;
  }

// hardcodes the behaviour of the neuron into an optimized function
  optimize(optimized, layer) {

    optimized = optimized || {};
    this._varID = optimized.memory || 0;

    this._store_activation = [];
    this._store_trace = [];
    this._store_propagation = [];
    this._inputs = optimized.inputs || [];
    this._targets = optimized.targets || [];
    this._outputs = optimized.outputs || [];
    this._variables = optimized.variables || {};
    this._activation_sentences = optimized.activation_sentences || [];
    this._trace_sentences = optimized.trace_sentences || [];
    this._propagation_sentences = optimized.propagation_sentences || [];
    this._layers = optimized.layers || {__count: 0, __neuron: 0};

    this.allocate(layer, this._activation_sentences);
    this.allocate(layer, this._trace_sentences);
    this.allocate(layer, this._propagation_sentences);
    this._currentLayer = this._layers.__count;

    // characteristics of the neuron
    this._noProjections = this.isEmpty(this.connections.projected);
    this._noGates = this.isEmpty(this.connections.gated);
    var isInput = layer == 'input' ? true : this.isEmpty(this.connections.inputs);
    var isOutput = layer == 'output' ? true : this._noProjections && this._noGates;

    // optimize neuron's behaviour
    var rate = this.getVar('rate');
    var activation = this.getVar(this, 'activation');
    if (isInput)
      this._inputs.push(activation.id);
    else {
      this._activation_sentences[this._currentLayer].push(this._store_activation);
      this._trace_sentences[this._currentLayer].push(this._store_trace);
      this._propagation_sentences[this._currentLayer].push(this._store_propagation);
      var old = this.getVar(this, 'old');
      var state = this.getVar(this, 'state');
      var bias = this.getVar(this, 'bias');
      if (this.selfconnection.gater)
        var self_gain = this.getVar(this.selfconnection, 'gain');
      if (this.selfconnected())
        var self_weight = this.getVar(this.selfconnection, 'weight');
      this.buildSentence(old, ' = ', state, this._store_activation);
      if (this.selfconnected())
        if (this.selfconnection.gater)
          this.buildSentence(state, ' = ', self_gain, ' * ', self_weight, ' * ',
            state, ' + ', bias, this._store_activation);
        else
          this.buildSentence(state, ' = ', self_weight, ' * ', state, ' + ',
            bias, this._store_activation);
      else
        this.buildSentence(state, ' = ', bias, this._store_activation);
      for (var i in this.connections.inputs) {
        var input = this.connections.inputs[i];
        var input_activation = this.getVar(input.from, 'activation');
        var input_weight = this.getVar(input, 'weight');
        if (input.gater)
          var input_gain = this.getVar(input, 'gain');
        if (this.connections.inputs[i].gater)
          this.buildSentence(state, ' += ', input_activation, ' * ',
            input_weight, ' * ', input_gain, this._store_activation);
        else
          this.buildSentence(state, ' += ', input_activation, ' * ',
            input_weight, this._store_activation);
      }
      var derivative = this.getVar(this, 'derivative');

      switch (this.squash) {
        case Neuron.squash.LOGISTIC:
          this.buildSentence(activation, ' = (1 / (1 + Math.exp(-', state, ')))',
            this._store_activation);
          this.buildSentence(derivative, ' = ', activation, ' * (1 - ',
            activation, ')', this._store_activation);
          break;

        case Neuron.squash.TANH:
          var eP = this.getVar('aux');
          var eN = this.getVar('aux_2');
          this.buildSentence(eP, ' = Math.exp(', state, ')', this._store_activation);
          this.buildSentence(eN, ' = 1 / ', eP, this._store_activation);
          this.buildSentence(activation, ' = (', eP, ' - ', eN, ') / (', eP, ' + ', eN, ')', this._store_activation);
          this.buildSentence(derivative, ' = 1 - (', activation, ' * ', activation, ')', this._store_activation);
          break;

        case Neuron.squash.IDENTITY:
          this.buildSentence(activation, ' = ', state, this._store_activation);
          this.buildSentence(derivative, ' = 1', this._store_activation);
          break;

        case Neuron.squash.HLIM:
          this.buildSentence(activation, ' = +(', state, ' > 0)', this._store_activation);
          this.buildSentence(derivative, ' = 1', this._store_activation);
          break;

        case Neuron.squash.RELU:
          this.buildSentence(activation, ' = ', state, ' > 0 ? ', state, ' : 0', this._store_activation);
          this.buildSentence(derivative, ' = ', state, ' > 0 ? 1 : 0', this._store_activation);
          break;
      }

      for (var id in this.trace.extended) {
        // calculate extended elegibility traces in advance
        this._neuron = this.neighboors[id];
        this._influence = this.getVar('influences[' + this._neuron.ID + ']');
        this._neuron_old = this.getVar(this._neuron, 'old');
        this._initialized = false;
        if (this._neuron.selfconnection.gater == this) {
          this.buildSentence(this._influence, ' = ', this._neuron_old, this._store_trace);
          this._initialized = true;
        }
        for (this._incoming in this.trace.influences[this._neuron.ID]) {
          this._incoming_weight = this.getVar(this.trace.influences[this._neuron.ID][this._incoming], 'weight');
          this._incoming_activation = this.getVar(this.trace.influences[this._neuron.ID][this._incoming].from, 'activation');

          if (this._initialized)
            this.buildSentence(this._influence, ' += ', this._incoming_weight, ' * ', this._incoming_activation, this._store_trace);
          else {
            this.buildSentence(this._influence, ' = ', this._incoming_weight, ' * ', this._incoming_activation, this._store_trace);
            this._initialized = true;
          }
        }
      }

      for (var i in this.connections.inputs) {
        var input = this.connections.inputs[i];
        if (input.gater)
          var input_gain = this.getVar(input, 'gain');
        var input_activation = this.getVar(input.from, 'activation');
        var trace = this.getVar(this, 'trace', 'elegibility', input.ID, this.trace
          .elegibility[input.ID]);
        if (this.selfconnected()) {
          if (this.selfconnection.gater) {
            if (input.gater)
              this.buildSentence(trace, ' = ', self_gain, ' * ', self_weight,
                ' * ', trace, ' + ', input_gain, ' * ', input_activation,
                this._store_trace);
            else
              this.buildSentence(trace, ' = ', self_gain, ' * ', self_weight,
                ' * ', trace, ' + ', input_activation, this._store_trace);
          } else {
            if (input.gater)
              this.buildSentence(trace, ' = ', self_weight, ' * ', trace, ' + ',
                input_gain, ' * ', input_activation, this._store_trace);
            else
              this.buildSentence(trace, ' = ', self_weight, ' * ', trace, ' + ',
                input_activation, this._store_trace);
          }
        } else {
          if (input.gater)
            this.buildSentence(trace, ' = ', input_gain, ' * ', input_activation,
              this._store_trace);
          else
            this.buildSentence(trace, ' = ', input_activation, this._store_trace);
        }
        for (var id in this.trace.extended) {
          // extended elegibility trace
          var neuron = this.neighboors[id];
          var influence = this.getVar('influences[' + neuron.ID + ']');

          var trace = this.getVar(this, 'trace', 'elegibility', input.ID, this.trace
            .elegibility[input.ID]);
          var xtrace = this.getVar(this, 'trace', 'extended', neuron.ID, input.ID,
            this.trace.extended[neuron.ID][input.ID]);
          if (neuron.selfconnected())
            var neuron_self_weight = this.getVar(neuron.selfconnection, 'weight');
          if (neuron.selfconnection.gater)
            var neuron_self_gain = this.getVar(neuron.selfconnection, 'gain');
          if (neuron.selfconnected())
            if (neuron.selfconnection.gater)
              this.buildSentence(xtrace, ' = ', neuron_self_gain, ' * ',
                neuron_self_weight, ' * ', xtrace, ' + ', derivative, ' * ',
                trace, ' * ', influence, this._store_trace);
            else
              this.buildSentence(xtrace, ' = ', neuron_self_weight, ' * ',
                xtrace, ' + ', derivative, ' * ', trace, ' * ',
                influence, this._store_trace);
          else
            this.buildSentence(xtrace, ' = ', derivative, ' * ', trace, ' * ',
              influence, this._store_trace);
        }
      }
      for (var connection in this.connections.gated) {
        var gated_gain = this.getVar(this.connections.gated[connection], 'gain');
        this.buildSentence(gated_gain, ' = ', activation, this._store_activation);
      }
    }
    if (!isInput) {
      var responsibility = this.getVar(this, 'error', 'responsibility', this.error
        .responsibility);
      if (isOutput) {
        var target = this.getVar('target');
        this.buildSentence(responsibility, ' = ', target, ' - ', activation,
          this._store_propagation);
        for (var id in this.connections.inputs) {
          var input = this.connections.inputs[id];
          var trace = this.getVar(this, 'trace', 'elegibility', input.ID, this.trace
            .elegibility[input.ID]);
          var input_weight = this.getVar(input, 'weight');
          this.buildSentence(input_weight, ' += ', rate, ' * (', responsibility,
            ' * ', trace, ')', this._store_propagation);
        }
        this._outputs.push(activation.id);
      } else {
        if (!this._noProjections && !this._noGates) {
          var error = this.getVar('aux');
          for (this._id in this.connections.projected) {
            var connection = this.connections.projected[this._id];
            var neuron = connection.to;
            var connection_weight = this.getVar(connection, 'weight');
            this._neuron_responsibility = this.getVar(neuron, 'error', 'responsibility', neuron.error.responsibility);
            if (connection.gater) {
              var connection_gain = this.getVar(connection, 'gain');
              this.buildSentence(
                error,
                ' += ',
                this._neuron_responsibility,
                ' * ',
                connection_gain,
                ' * ',
                connection_weight,
                this._store_propagation
              );
            } else
              this.buildSentence(
                error,
                ' += ',
                this._neuron_responsibility,
                ' * ',
                connection_weight,
                this._store_propagation
              );
          }
          var projected = this.getVar(this, 'error', 'projected', this.error.projected);
          this.buildSentence(projected, ' = ', derivative, ' * ', error,
            this._store_propagation);
          this.buildSentence(error, ' = 0', this._store_propagation);
          for (this._id in this.trace.extended) {
            var neuron = this.neighboors[this._id];
            var influence = this.getVar('aux_2');
            var neuron_old = this.getVar(neuron, 'old');
            if (neuron.selfconnection.gater == this)
              this.buildSentence(influence, ' = ', neuron_old, this._store_propagation);
            else
              this.buildSentence(influence, ' = 0', this._store_propagation);
            for (var input in this.trace.influences[neuron.ID]) {
              var connection = this.trace.influences[neuron.ID][input];
              var connection_weight = this.getVar(connection, 'weight');
              var neuron_activation = this.getVar(connection.from, 'activation');
              this.buildSentence(influence, ' += ', connection_weight, ' * ',
                neuron_activation, this._store_propagation);
            }
            this._neuron_responsibility = this.getVar(
              neuron,
              'error',
              'responsibility',
              neuron.error.responsibility
            );
            this.buildSentence(
              error,
              ' += ',
              this._neuron_responsibility,
              ' * ',
              influence,
              this._store_propagation
            );
          }
          this._gated = this.getVar(this, 'error', 'gated', this.error.gated);
          this.buildSentence(
            this._gated,
            ' = ',
            derivative,
            ' * ',
            error,
            this._store_propagation
          );
          this.buildSentence(
            responsibility,
            ' = ',
            projected,
            ' + ',
            this._gated,
            this._store_propagation
          );
          for (this._id in this.connections.inputs) {
            this._input = this.connections.inputs[this._id];
            var gradient = this.getVar('aux');
            var trace = this.getVar(
              this,
              'trace',
              'elegibility',
              this._input.ID,
              this.trace.elegibility[this._input.ID]
            );
            this.buildSentence(
              gradient,
              ' = ',
              projected,
              ' * ',
              trace,
              this._store_propagation
            );
            for (this._id in this.trace.extended) {
              var neuron = this.neighboors[this._id];
              var neuron_responsibility = this.getVar(
                neuron,
                'error',
                'responsibility',
                neuron.error.responsibility
              );
              var xtrace = this.getVar(
                this,
                'trace',
                'extended',
                neuron.ID,
                this._input.ID,
                this.trace.extended[neuron.ID][this._input.ID]
              );
              this.buildSentence(
                gradient,
                ' += ',
                neuron_responsibility,
                ' * ',
                xtrace,
                this._store_propagation
              );
            }
            this._input_weight = this.getVar(this._input, 'weight');
            this.buildSentence(
              this._input_weight,
              ' += ',
              rate,
              ' * ',
              gradient,
              this._store_propagation
            );
          }

        } else if (this._noGates) {
          this.buildSentence(responsibility, ' = 0', this._store_propagation);
          for (this._id in this.connections.projected) {
            this._connection = this.connections.projected[this._id];
            var neuron = this._connection.to;
            var connection_weight = this.getVar(this._connection, 'weight');
            var neuron_responsibility = this.getVar(neuron, 'error', 'responsibility', neuron.error.responsibility);

            if (this._connection.gater) {
              var connection_gain = this.getVar(this._connection, 'gain');
              this.buildSentence(
                responsibility,
                ' += ',
                neuron_responsibility,
                ' * ',
                connection_gain,
                ' * ',
                connection_weight,
                this._store_propagation
              );
            } else
              this.buildSentence(
                responsibility,
                ' += ',
                neuron_responsibility,
                ' * ',
                connection_weight,
                this._store_propagation
              );
          }

          this.buildSentence(responsibility, ' *= ', derivative,this._store_propagation);

          for (this._id in this.connections.inputs) {
            this._input = this.connections.inputs[this._id];
            this._trace = this.getVar(
              this,
              'trace',
              'elegibility',
              this._input.ID,
              this.trace.elegibility[this._input.ID]
            );
            this._input_weight = this.getVar(this._input, 'weight');
            this.buildSentence(
              this._input_weight,
              ' += ',
              rate,
              ' * (',
              responsibility,
              ' * ',
              this._trace, ')',
              this._store_propagation
            );
          }
        } else if (this._noProjections) {
          this.buildSentence(responsibility, ' = 0', this._store_propagation);

          for (this._id in this.trace.extended) {
            var neuron = this.neighboors[this._id];
            var influence = this.getVar('aux');
            var neuron_old = this.getVar(neuron, 'old');
            if (neuron.selfconnection.gater == this)
              this.buildSentence(influence, ' = ', neuron_old, this._store_propagation);
            else
              this.buildSentence(influence, ' = 0', this._store_propagation);
            for (this._input in this.trace.influences[neuron.ID]) {
              this._connection = this.trace.influences[neuron.ID][this._input];
              var connection_weight = this.getVar(this._connection, 'weight');
              var neuron_activation = this.getVar(this._connection.from, 'activation');
              this.buildSentence(influence, ' += ', connection_weight, ' * ',
                neuron_activation, this._store_propagation);
            }
            this._neuron_responsibility = this.getVar(neuron, 'error', 'responsibility', neuron.error.responsibility);
            this.buildSentence(
              responsibility,
              ' += ',
              this._neuron_responsibility,
              ' * ',
              influence,
              this._store_propagation
            );
          }
          this.buildSentence(responsibility, ' *= ', derivative, this._store_propagation);

          for (this._i in this.connections.inputs) {
            this._input = this.connections.inputs[this._i];
            this._gradient = this.getVar('aux');
            this.buildSentence(this._gradient, ' = 0', this._store_propagation);
            for (this._id in this.trace.extended) {
              this._neuron = this.neighboors[this._id];
              this._neuron_responsibility = this.getVar(
                this._neuron,
                'error',
                'responsibility',
                this._neuron.error.responsibility
              );
              this._xtrace = this.getVar(
                this,
                'trace',
                'extended',
                this._neuron.ID,
                this._input.ID,
                this.trace.extended[this._neuron.ID][this._input.ID]
              );
              this.buildSentence(
                this._gradient,
                ' += ',
                this._neuron_responsibility,
                ' * ',
                this._xtrace,
                this._store_propagation
              );
            }
            this._input_weight = this.getVar(this._input, 'weight');

            this.buildSentence(
              this._input_weight,
              ' += ',
              rate,
              ' * ',
              this._gradient,
              this._store_propagation
            );
          }
        }
      }
      this.buildSentence(bias, ' += ', rate, ' * ', responsibility,
        this._store_propagation);
    }

    return {
      memory: this._varID,
      inputs: this._inputs,
      layers: this._layers,
      neurons: neurons + 1,
      outputs: this._outputs,
      targets: this._targets,
      variables: this._variables,
      trace_sentences: this._trace_sentences,
      activation_sentences: this._activation_sentences,
      propagation_sentences: this._propagation_sentences,
    }
  }

  // build sentence
  buildSentence() {
    this._args = Array.prototype.slice.call(arguments);
    this._store = this._args.pop();
    this._sentence = '';
    for (this._i = 0; this._i < this._args.length; this._i++) {
      if (typeof this._args[this._i] == 'string')
        this._sentence += this._args[this._i];
      else
        this._sentence += 'F[' + this._args[this._i].id + ']';
    }

    this._store.push(this._sentence + ';');
  }

  // allocate sentences
  allocate(layer, store) {
    this._allocated = layer in this._layers && store[this._layers.__count];
    if (!this._allocated) {
      this._layers.__count = store.push([]) - 1;
      this._layers[layer] = this._layers.__count;
    }
  }

  // get/reserve space in memory by creating a unique ID for a variablel
  getVar() {
    this._args = Array.prototype.slice.call(arguments);

    if (this._args.length == 1) {
      this._id = '';

      if (this._args[0] == 'target') {
        this._id = `target_${this._targets.length}`;
        this._targets.push(this._varID);
      } else
        this._id = this._args[0];

      if (this._id in this._variables)

        return this._variables[this._id];
      else

        return this._variables[this._id] = {
          value: 0,
          id: this._varID++
        };

    } else {
      this._extended = this._args.length > 2;
      if (this._extended)
        this._value = this._args.pop();

      this._unit = this._args.shift();
      this._prop = this._args.pop();

      if (!this._extended)
        this._value = this._unit[this._prop];

      this._id = `${this._prop}_`;

      for (this._i in this._args)
        this._id += `${this._args[this._i]}_`;

      this._id += this._unit.ID;

      if (this._id in this._variables)
        return this._variables[this._id];
      else
        return this._variables[this._id] = {
          value: this._value,
          id: this._varID++
        };
    }
  }

  // helper to check if an object is empty
  isEmpty(obj) {
    for (this._i in obj) {
      if (obj.hasOwnProperty(this._i))
        return false;
    }

    return true;
  }

  static uid() {
    return neurons++;
  }

  static quantity() {
    return {
      neurons: neurons,
      connections: connections
    }
  }
}