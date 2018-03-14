import LayerConnection from './LayerConnection';
import Neuron from './Neuron';
import Network from './Network';

export default class Layer {
  constructor(size) {
    this.size = size | 0;
    this.list = [];

    this.connectedTo = [];

    while (size--) {
      this._neuron = new Neuron();
      this.list.push(this._neuron);
    }
  }

  // types of connections
  static connectionType = {
    ALL_TO_ALL: "ALL TO ALL",
    ONE_TO_ONE: "ONE TO ONE",
    ALL_TO_ELSE: "ALL TO ELSE"
  };

  // types of gates
  static gateType = {
    INPUT: "INPUT",
    OUTPUT: "OUTPUT",
    ONE_TO_ONE: "ONE TO ONE"
  };

  // activates all the neurons in the layer
  activate(input) {
    this._activations = [];

    if (typeof input != 'undefined') {
      if (input.length != this.size)
        throw new Error('INPUT size and LAYER size must be the same to activate!');

      for (this._i in this.list) {
        this._neuron = this.list[this._i];
        this._activation = this._neuron.activate(input[this._i]);
        this._activations.push(this._activation);
      }
    } else {
      for (this._i in this.list) {
        this._neuron = this.list[this._i];
        this._activation = this._neuron.activate();
        this._activations.push(this._activation);
      }
    }

    return this._activations;
  }

// propagates the error on all the neurons of the layer
  propagate(rate, target) {
    if (typeof target != 'undefined') {
      if (target.length != this.size)
        throw new Error('TARGET size and LAYER size must be the same to propagate!');

      for (this._i = this.list.length - 1; this._i >= 0; this._i--)
        this.list[this._i].propagate(rate, target[this._i]);

    } else
      for (this._i = this.list.length - 1; this._i >= 0; this._i--)
        this.list[this._i].propagate(rate);
  }

// projects a connection from this layer to another one
  project(layer, type, weights) {

    if (layer instanceof Network)
      layer = layer.layers.input;

    if (layer instanceof Layer) {
      if (!this.connected(layer))
        return new LayerConnection(this, layer, type, weights);
    } else
      throw new Error('Invalid argument, you can only project connections to LAYERS and NETWORKS!');


  }

// gates a connection betwenn two layers
  gate(connection, type) {
    switch (true) {
      case (type == Layer.gateType.INPUT):
        if (connection.to.size != this.size)
          throw new Error('GATER layer and CONNECTION.TO layer must be the same size in order to gate!');

        for (this._i in connection.to.list) {
          this._neuron = connection.to.list[this._i];

          for (this._j in this._neuron.connections.inputs) {
            this._gated = this._neuron.connections.inputs[this._j];

            if (this._gated.ID in connection.connections)
              this.list[this._i].gate(this._gated);
          }
        }
        break;

      case (type == Layer.gateType.OUTPUT) :
        if (connection.from.size != this.size)
          throw new Error('GATER layer and CONNECTION.FROM layer must be the same size in order to gate!');

        for (this._i in connection.from.list) {
          this._neuron = connection.from.list[this._i];

          for (this._j in this._neuron.connections.projected) {
            this._gated = this._neuron.connections.projected[this._j];

            if (this._gated.ID in connection.connections)
              this.list[this._i].gate(this._gated);
          }
        }
        break;

      case (type == Layer.gateType.ONE_TO_ONE) :
        if (connection.size != this.size)
          throw new Error('The number of GATER UNITS must be the same as the number of CONNECTIONS to gate!');

        for (this._i in connection.list)
          this.list[this._i].gate(connection.list[this._i]);
        break;
    }

    connection.gatedfrom.push({layer: this, type: type});
  }

  // true or false whether the whole layer is self-connected or not
  selfconnected() {
    for (this._i in this.list) {
      this._neuron = this.list[this._i];

      if (!this._neuron.selfconnected())
        return false;
    }

    return true;
  }

  // true of false whether the layer is connected to another layer (parameter) or not
  connected(layer) {
    switch (true) {
      case (this.countAllToAll(layer) == this.size * layer.size) :
        return Layer.connectionType.ALL_TO_ALL;

      case (this.countOneToOne(layer) == this.size) :
        return Layer.connectionType.ONE_TO_ONE;
    }
  }

  // Check if ALL to ALL connection
  countAllToAll(layer) {
    this._connections = 0;

    for (this._i in this.list) {
      for (this._j in layer.list) {
        this._connected = this.list[this._i].connected(layer.list[this._j]);

        if (this._connected.type == 'projected')
          this._connections++;
      }
    }

    return this._connections;
  }

  // Check if ONE to ONE connection
  countOneToOne(layer) {
    this._connections = 0;

    for (this._i in this.list) {
      this._connected = this.list[this._i].connected(layer.list[this._i]);

      if (this._connected.type == 'projected')
        this._connections++;
    }
  }

// clears all the neuorns in the layer
  clear() {
    for (this._i in this.list)
      this.list[this._i].clear();
  }

// resets all the neurons in the layer
  reset() {
    for (this._i in this.list)
      this.list[this._i].reset();
  }

// returns all the neurons in the layer (array)
  neurons() {
    return this.list;
  }

// adds a neuron to the layer
  add(neuron = new Neuron()) {
    this.list.push(neuron);
    this.size++;
  }

  set(options = {}) {
    for (this._i in this.list) {
      this._neuron = this.list[this._i];

      if (options.label)
        this._neuron.label = `${options.label}_${this._neuron.ID}`;

      if (options.squash)
        this._neuron.squash = options.squash;

      if (options.bias)
        this._neuron.bias = options.bias;
    }

    return this;
  }
}
