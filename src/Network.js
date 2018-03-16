'use strict';
import Neuron from './Neuron';
import Layer from './Layer';
import Trainer from './Trainer';

export default class Network {
  constructor(layers) {
    if (typeof layers !== 'undefined') {
      this.layers = {
        input: layers.input || null,
        hidden: layers.hidden || [],
        output: layers.output || null
      };
      this.optimized = null;
    }
  }

  // feed-forward activation of all the layers to produce an ouput
  activate(input) {
    if (this.optimized === false) {
      this.layers.input.activate(input);

      for (this._i in this.layers.hidden)
        this.layers.hidden[this._i].activate();

      return this.layers.output.activate();
    }
    else {
      if (this.optimized == null)
        this.optimize();

      return this.optimized.activate(input);
    }
  }

  // back-propagate the error thru the network
  propagate(rate, target) {
    if (this.optimized === false) {
      this.layers.output.propagate(rate, target);

      this._i = this.layers.hidden.length;
      while (this._i--)
        this.layers.hidden[this._i].propagate(rate);
    }
    else {
      if (this.optimized == null)
        this.optimize();

      this.optimized.propagate(rate, target);
    }
  }

  // project a connection to another unit (either a network or a layer)
  project(unit, type, weights) {
    if (this.optimized)
      this.optimized.reset();

    switch (true) {
      case (unit instanceof Network):
        return this.layers.output.project(unit.layers.input, type, weights);

      case (unit instanceof Layer):
        return this.layers.output.project(unit, type, weights);

      default :
        throw new Error('Invalid argument, you can only project connections to LAYERS and NETWORKS!');
    }
  }

  // let this network gate a connection
  gate(connection, type) {
    if (this.optimized)
      this.optimized.reset();

    this.layers.output.gate(connection, type);
  }

  // clear all elegibility traces and extended elegibility traces (the network forgets its context, but not what was trained)
  clear() {
    this.restore();
    this.layers.input.clear();

    for (this._i in this.layers.hidden)
      this.layers.hidden[this._i].clear();

    this.layers.output.clear();

    if (this.optimized)
      this.optimized.reset();
  }

  // reset all weights and clear all traces (ends up like a new network)
  reset() {
    this.restore();
    this.layers.input.reset();

    for (this._i in this.layers.hidden) {
      this.layers.hidden[i].reset();
    }

    this.layers.output.reset();

    if (this.optimized)
      this.optimized.reset();
  }

  // hardcodes the behaviour of the whole network into a single optimized function
  optimize() {
    this._optimized = {};
    this._neurons = this.neurons();

    for (this._i in this._neurons) {
      this._neuron = this._neurons[this._i].neuron;
      this._layer = this._neurons[this._i].layer;

      while (this._neuron.neuron)
        this._neuron = this._neuron.neuron;

      this._optimized = this._neuron.optimize(this._optimized, this._layer);
    }

    for (this._i in this._optimized.propagation_sentences)
      this._optimized.propagation_sentences[this._i].reverse();

    this._optimized.propagation_sentences.reverse();

    this._hardcode = '';
    this._hardcode += `const F = Float64Array ? new Float64Array(${this._optimized.memory}) : []; `;

    for (this._i in this._optimized.variables)
      this._hardcode += `F[${this._optimized.variables[this._i].id}] = ${this._optimized.variables[this._i].value || 0}; `;

    this._hardcode += 'this._activate = input => {\n';

    for (this._i in this._optimized.inputs)
      this._hardcode += `F[${this._optimized.inputs[this._i]}] = input[${this._i}]; `;

    for (this._i in this._optimized.activation_sentences) {
      if (this._optimized.activation_sentences[this._i].length > 0) {
        for (this._j in this._optimized.activation_sentences[this._i]) {
          this._hardcode += this._optimized.activation_sentences[this._i][this._j].join(' ');
          this._hardcode += this._optimized.trace_sentences[this._i][this._j].join(' ');
        }
      }
    }

    this._hardcode += ' this._output = []; '

    for (this._i in this._optimized.outputs)
    this._hardcode += `this._output[${this._i}] = F[${this._optimized.outputs[this._i]}]; `;

    this._hardcode += 'return this._output; }; '
    this._hardcode += 'this._propagate = (rate, target) => {\n';
    this._hardcode += `F[${this._optimized.variables.rate.id}] = rate; `;

    for (this._i = 0 in this._optimized.targets)
      this._hardcode += `F[${this._optimized.targets[this._i]}] = target[${this._i}]; `;

    for (this._i in this._optimized.propagation_sentences)
      for (this._j in this._optimized.propagation_sentences[this._i])
        this._hardcode += this._optimized.propagation_sentences[this._i][this._j].join(' ') + ' ';

    this._hardcode += ' };\n';
    this._hardcode += 'this._ownership = memoryBuffer => {\nF = memoryBuffer;\nthis.memory = F;\n};\n';
    this._hardcode += 'return {\nmemory: F,\nactivate: this._activate,\npropagate: this._propagate,\nownership: this._ownership\n};';
    this._hardcode = this._hardcode.split(';').join(';\n');

    this._constructor = new Function(this._hardcode);

    this._network = this._constructor();
    this._network.data = {
      trace: this._optimized.trace_sentences,
      inputs: this._optimized.inputs,
      outputs: this._optimized.outputs,
      activate: this._optimized.activation_sentences,
      variables: this._optimized.variables,
      propagate: this._optimized.propagation_sentences,
      check_activation: this.activate,
      check_propagation: this.propagate
    }

    this._network.reset = () => {
      if (this.optimized) {
        this.optimized = null;
        this.activate = this._network.data.check_activation;
        this.propagate = this._network.data.check_propagation;
      }
    }

    this.optimized = this._network;
    this.activate = this._network.activate;
    this.propagate = this._network.propagate;
  }

  // restores all the values from the optimized network the their respective objects in order to manipulate the network
  restore() {
    if (!this.optimized)
      return;

    this._optimized = this.optimized;

    this._list = this.neurons();

    // link id's to positions in the array
    for (this._i in this._list) {
      this._neuron = list[this._i].neuron;

      while (this._neuron.neuron)
        this._neuron = this._neuron.neuron;

      this._neuron.state = this.getValue(this._neuron, 'state');
      this._neuron.old = this.getValue(this._neuron, 'old');
      this._neuron.activation = this.getValue(this._neuron, 'activation');
      this._neuron.bias = this.getValue(this._neuron, 'bias');

      for (this._input in this._neuron.trace.elegibility)
        this._neuron.trace.elegibility[this._input] = this.getValue(
          this._neuron,
          'trace',
          'elegibility',
          this._input
        );

      for (this._gated in this._neuron.trace.extended)
        for (this._input in this._neuron.trace.extended[this._gated])
          this._neuron.trace.extended[this._gated][this._input] = this.getValue(
            this._neuron,
            'trace',
            'extended',
            this._gated,
            this._input
          );

      // get connections
      for (this._j in this._neuron.connections.projected) {
        this._connection = this._neuron.connections.projected[this._j];
        this._connection.weight = this.getValue(this._connection, 'weight');
        this._connection.gain = this.getValue(this._connection, 'gain');
      }
    }
  }

  getValue() {
    this._args = Array.prototype.slice.call(arguments);

    this._unit = this._args.shift();
    this._prop = this._args.pop();

    this._id = `${this._prop}_`;

    for (this._property in this._args)
      this._id += `${this._args[this._property]}_`;

    this._id += this._unit.ID;

    if (this._id in this._optimized.data.variables)
      return this._optimized.memory[this._optimized.data.variables[this._id].id];
    else
      return 0;
  }

  // returns all the neurons in the network
  neurons() {
    this._neurons = [];

    this._inputLayer = this.layers.input.neurons();
    this._outputLayer = this.layers.output.neurons();

    for (this._i in this._inputLayer) {
      this._neurons.push({
        neuron: this._inputLayer[this._i],
        layer: 'input'
      });
    }

    for (this._i in this.layers.hidden) {
      this._hiddenLayer = this.layers.hidden[this._i].neurons();

      for (this._j in this._hiddenLayer)
        this._neurons.push({
          neuron: this._hiddenLayer[this._j],
          layer: this._i
        });
    }

    for (this._i in this._outputLayer) {
      this._neurons.push({
        neuron: this._outputLayer[this._i],
        layer: 'output'
      });
    }

    return this._neurons;
  }

  // returns number of inputs of the network
  inputs() {
    return this.layers.input.size;
  }

  // returns number of outputs of hte network
  outputs() {
    return this.layers.output.size;
  }

  // sets the layers of the network
  set(layers) {
    this.layers = {
      input: layers.input || null,
      hidden: layers.hidden || [],
      output: layers.output || null
    };

    if (this.optimized)
      this.optimized.reset();
  }

  setOptimize(bool) {
    this.restore();

    if (this.optimized)
      this.optimized.reset();

    this.optimized = bool ? null : false;
  }

  // returns a json that represents all the neurons and connections of the network
  toJSON(ignoreTraces) {
    this.restore();

    this._list = this.neurons();
    this._neurons = [];
    this._connections = [];
    this._ids = {};

    // link id's to positions in the array
    for (this._i in this._list) {
      this._neuron = this._list[this._i].neuron;

      this._ids[this._neuron.ID] = this._i;

      this._copy = {
        trace: {
          elegibility: {},
          extended: {}
        },
        state: this._neuron.state,
        old: this._neuron.old,
        activation: this._neuron.activation,
        bias: this._neuron.bias,
        layer: this._list[this._i].layer
      };

      this._copy.squash = this._neuron.squash == this._neuron.squash.LOGISTIC ? 'LOGISTIC' :
        this._neuron.squash == this._neuron.squash.TANH ? 'TANH' :
          this._neuron.squash == this._neuron.squash.IDENTITY ? 'IDENTITY' :
            this._neuron.squash == this._neuron.squash.HLIM ? 'HLIM' :
              this._neuron.squash == this._neuron.squash.RELU ? 'RELU' :
                null;

      this._neurons.push(this._copy);
    }

    for (this._i in this._list) {
      this._neuron = this._list[this._i].neuron;

      while (this._neuron.neuron)
        this._neuron = this._neuron.neuron;

      for (this._j in this._neuron.connections.projected) {
        this._connection = this._neuron.connections.projected[this._j];

        this._connections.push({
          from: this._ids[this._connection.from.ID],
          to: this._ids[this._connection.to.ID],
          weight: this._connection.weight,
          gater: this._connection.gater ? this._ids[this._connection.gater.ID] : null,
        });
      }

      if (this._neuron.selfconnected()) {
        this._connections.push({
          from: this._ids[this._neuron.ID],
          to: this._ids[this._neuron.ID],
          weight: this._neuron.selfconnection.weight,
          gater: this._neuron.selfconnection.gater ? this._ids[this._neuron.selfconnection.gater.ID] : null,
        });
      }
    }

    return {
      neurons: this._neurons,
      connections: this._connections
    }
  }

  // export the topology into dot language which can be visualized as graphs using dot
  /* example: ... console.log(net.toDotLang());
              $ node example.js > example.dot
              $ dot example.dot -Tpng > out.png
  */
  toDot(edgeConnection) {
    if (!typeof edgeConnection)
      edgeConnection = false;

    this._code = 'digraph nn {\n    rankdir = BT\n';

    this._layers = [this.layers.input].concat(this.layers.hidden, this.layers.output);

    for (this._i in this._layers) {
      for (this._j in this._[this._i].connectedTo) { // projections
        this._connection = this._layers[this._i].connectedTo[this._j];
        this._layerToID = this._layers.indexOf(this._connection.to);

        /* http://stackoverflow.com/questions/26845540/connect-edges-with-graph-dot
         * DOT does not support edge-to-edge connections
         * This workaround produces somewhat weird graphs ...
        */
        if (!!edgeConnection) {
          if (!!this._connection.gatedfrom.length) {
            this._connection.sizefakeNode = `fake${this._i}_${this._layerToID}`;
            this._code += `    ${this._connection.sizefakeNode} [label = "", shape = point, width = 0.01, height = 0.01]\n`;
            this._code += `    ${this._i} -> ${this._connection.sizefakeNode} [label = ${this._connection.size}, arrowhead = none]\n`;
            this._code += `    ${this._connection.sizefakeNode} -> ${this._layerToID}\n`;
          } else
            this._code += `    ${this._i} -> ${this._layerToID} [label = ${this._connection.size}]\n`;

          for (this._from in this._connection.gatedfrom) { // gatings
            this._layerfrom = this._connection.gatedfrom[this._from].layer;
            this._layerfromID = layers.indexOf(this._layerfrom);
            this._code += `    ${this._layerfromID} -> ${this._connection.sizefakeNode} [color = blue]\n`;
          }
        } else {
          this._code += `    ${this._i} -> ${this._layerToID} [label = ${this._connection.size}]\n`;

          for (this._from in this._connection.gatedfrom) { // gatings
            this._layerfrom = this._connection.gatedfrom[this._from].layer;
            this._layerfromID = layers.indexOf(this._layerfrom);
            this._code += `    ${this._layerfromID} -> ${this._layerToID} [color = blue]\n`;
          }
        }
      }
    }
    this._code += '}\n';

    return {
      code: this._code,
      link: `https://chart.googleapis.com/chart?chl=${escape(code.replace('/ /g', '+'))}&cht=gv`
    }
  }

  // returns a function that works as the activation of the network and can be used without depending on the library
  standalone() {
    if (!this.optimized)
      this.optimize();

    this._data = this.optimized.data;

    // build activation function
    this._activation = 'input => {\n';

    // build inputs
    for (this._i in this._data.inputs)
      this._activation += `F[${this._data.inputs[this._i]}] = input[${this._i}];\n`;

    // build network activation
    for (this._i in this._data.activate) { // shouldn't this be layer?
      for (this._j in this._data.activate[this._i])
        this._activation += `${this._data.activate[this._i][this._j].join('')}\n`;
    }

    // build outputs
    this._activation += 'const output = [];\n';

    for (this._i in this._data.outputs)
      this._activation += 'output[${this._i}] = F[${this._data.outputs[this._i]}];\n';

    this._activation += 'return output;\n}';

    // reference all the positions in memory
    this._memory = this._activation.match(/F\[(\d+)\]/g);
    this._dimension = 0;
    this._ids = {};

    for (this._i in this._memory) {
      this._tmp = this._memory[this._i].match(/\d+/)[0];
      if (!(this._tmp in this._ids)) {
        this._ids[this._tmp] = this._dimension++;
      }
    }
    this._hardcode = 'F = {\n';

    for (this._i in this._ids)
      this._hardcode += `${this._ids[this._i]}: ${this.optimized.memory[this._i]},\n`;

    this._hardcode = `${this._hardcode.substring(0, this._hardcode.length - 2)}\n};\n`;
    this._hardcode = 'const run = ';
    this._hardcode += this._activation
      .replace(/F\[(\d+)]/g, index => {
        return `F[${this._ids[index.match(/\d+/)[0]]}]`
      })
      .replace('{\n', `{\n${this._hardcode}`) + ';\n';

    this._hardcode += 'return run';

    // return standalone function
    return new Function(this._hardcode)();
  }


  // Return a HTML5 WebWorker specialized on training the network stored in `memory`.
  // Train based on the given dataSet and options.
  // The worker returns the updated `memory` when done.
  worker(
    memory,
    set,
    options
  ) {
    // Copy the options and set defaults (options might be different for each worker)
    this._workerOptions = {};

    if (options)
      this._workerOptions = options;

    this._workerOptions.rate = this._workerOptions.rate || .2;
    this._workerOptions.iterations = this._workerOptions.iterations || 100000;
    this._workerOptions.error = this._workerOptions.error || .005;
    this._workerOptions.cost = this._workerOptions.cost || null;
    this._workerOptions.crossValidate = this._workerOptions.crossValidate || null;

    // Cost function might be different for each worker
    this._costFunction = '// REPLACED BY WORKER\nvar cost = ' + (options && options.cost || this.cost || Trainer.cost.MSE) + ';\n';
    this._workerFunction = Network.getWorkerSharedFunctions();
    this._workerFunction = this._workerFunction.replace(/const cost = options && options\.cost \|\| this\.cost \|\| Trainer\.cost\.MSE;/g, this._costFunction);

    // Set what we do when training is finished
    this._workerFunction = this._workerFunction.replace('return results;',
      'postMessage({action: "done", message: results, memoryBuffer: F}, [F.buffer]);');

    // Replace log with postmessage
    this._workerFunction = this._workerFunction.replace('console.log(\'iterations\', iterations, \'error\', error, \'rate\', currentRate)',
      'postMessage({action: \'log\', message: {\n' +
      'iterations: iterations,\n' +
      'error: error,\n' +
      'rate: currentRate\n' +
      '}\n' +
      '})');

    // Replace schedule with postmessage
    this._workerFunction = this._workerFunction.replace('abort = this.schedule.do({ error: error, iterations: iterations, rate: currentRate })',
      'postMessage({action: \'schedule\', message: {\n' +
      'iterations: iterations,\n' +
      'error: error,\n' +
      'rate: currentRate\n' +
      '}\n' +
      '})');

    if (!this.optimized)
      this.optimize();

    this._hardcode = `const inputs = ${this.optimized.data.inputs.length};\n`;
    this._hardcode += `const outputs = ${this.optimized.data.outputs.length};\n`;
    this._hardcode += `const F =  new Float64Array([${this.optimized.memory.toString()}]);\n`;
    this._hardcode += `const activate = ${this.optimized.activate.toString()};\n`;
    this._hardcode += `const propagate = ${this.optimized.propagate.toString()};\n`;
    this._hardcode +=
      'onmessage = e => {\n' +
      'if (e.data.action == \'startTraining\') {\n' +
      `train(${JSON.stringify(set)},${JSON.stringify(this._workerOptions)});\n` +
      '}\n' +
      '}';

    this._workerSourceCode = `${this._workerFunction}\n${this._hardcode}`;
    this._blob = new Blob([this._workerSourceCode]);
    this._blobURL = window.URL.createObjectURL(this._blob);

    return new Worker(this._blobURL);
  }

  // returns a copy of the network
  clone() {
    return Network.fromJSON(this.toJSON());
  }

  /**
   * Creates a static String to store the source code of the functions
   *  that are identical for all the workers (train, _trainSet, test)
   *
   * @return {String} Source code that can train a network inside a worker.
   * @static
   */
  static getWorkerSharedFunctions() {
    // If we already computed the source code for the shared functions
    if (typeof Network._SHARED_WORKER_FUNCTIONS !== 'undefined')
      return Network._SHARED_WORKER_FUNCTIONS;

    // Otherwise compute and return the source code
    // We compute them by simply copying the source code of the train, _trainSet and test functions
    //  using the .toString() method

    // Load and name the train function
    this._train_f = Trainer.prototype.train.toString();
    this._train_f = this._train_f.replace(/this._trainSet/g, '_trainSet');
    this._train_f = this._train_f.replace(/this.test/g, 'test');
    this._train_f = this._train_f.replace(/this.crossValidate/g, 'crossValidate');
    this._train_f = this._train_f.replace('crossValidate = true', '// REMOVED BY WORKER');

    // Load and name the _trainSet function
    this._trainSet_f = Trainer.prototype._trainSet.toString().replace(/this.network./g, '');

    // Load and name the test function
    this._test_f = Trainer.prototype.test.toString().replace(/this.network./g, '');

    return Network._SHARED_WORKER_FUNCTIONS = `${this._train_f}\n${this._trainSet_f}\n${this._test_f}`;
  };

  static fromJSON(json) {
    this._neurons = [];

    this._layers = {
      input: new Layer(),
      hidden: [],
      output: new Layer()
    };

    for (this._i in json.neurons) {
      this._config = json.neurons[this._i];

      this._neuron = new Neuron();
      this._neuron.trace.elegibility = {};
      this._neuron.trace.extended = {};
      this._neuron.state = this._config.state;
      this._neuron.old = this._config.old;
      this._neuron.activation = this._config.activation;
      this._neuron.bias = this._config.bias;
      this._neuron.squash = this._config.squash in Neuron.squash ? Neuron.squash[this._config.squash] : Neuron.squash.LOGISTIC;
      this._neurons.push(this._neuron);

      switch (true) {
        case (this._config.layer === 'input') :
          this._layers.input.add(this._neuron);
          break;

        case (this._config.layer === 'output') :
          this._layers.output.add(this._neuron);
          break;

        default :
          if (typeof this._layers.hidden[this._config.layer] === 'undefined')
            this._layers.hidden[this._config.layer] = new Layer();

          this._layers.hidden[this._config.layer].add(this._neuron);
          break;
      }
    }

    for (this._i in json.connections) {
      this._config = json.connections[this._i];
      this._from = this._neurons[this._config.from];
      this._to = this._neurons[this._config.to];
      this._weight = this._config.weight;
      this._gater = this._neurons[this._config.gater];
      this._connection = this._from.project(this._to, this._weight);

      if (this._gater)
        this._gater.gate(this._connection);
    }

    return new Network(this._layers);
  };
}
