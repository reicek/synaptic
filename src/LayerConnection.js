import Layer from './Layer';
// represents a connection from one layer to another, and keeps track of its weight and gain
export let connections = 0;

export default class LayerConnection {
  constructor(
    fromLayer,
    toLayer,
    type,
    weights
  ) {
    this.ID = LayerConnection.uid();
    this.from = fromLayer;
    this.to = toLayer;
    this.selfconnection = toLayer === fromLayer;
    this.connections = {};
    this.list = [];
    this.size = 0;
    this.gatedfrom = [];

    this.getType(fromLayer, toLayer, type);
    this.establish(fromLayer, weights);
  }

  getType(
    fromLayer,
    toLayer,
    type
  ) {
    if (typeof type === 'undefined') {
      if (fromLayer === toLayer)
        type = Layer.connectionType.ONE_TO_ONE;
      else
        type = Layer.connectionType.ALL_TO_ALL;
    }

    this.type = {
      allToAll: type === Layer.connectionType.ALL_TO_ALL,
      allToElse: type === Layer.connectionType.ALL_TO_ELSE,
      oneToOne: type === Layer.connectionType.ONE_TO_ONE
    };
  }

  establish(
    fromLayer,
    weights
  ) {
    switch (true) {
      case (!!this.type.allToAll || !!this.type.allToElse):
        this.allToAll(weights);
        break;

      case (!!this.type.oneToOne):
        this.oneToOne(weights);
        break;
    }

    fromLayer.connectedTo.push(this);
  }

  allToAll(weights) {
    for (this._i in this.from.list) {
      for (this._j in this.to.list) {
        this._from = this.from.list[this._i];
        this._to = this.to.list[this._j];

        if(this.type === Layer.connectionType.ALL_TO_ELSE && this._from === this._to)
          continue;

        this._connection = this._from.project(this._to, weights);

        this.connections[this._connection.ID] = this._connection;
        this.size = this.list.push(this._connection);
      }
    }
  }

  oneToOne(weights) {
    for (this._i in this.from.list) {
      this._from = this.from.list[this._i];
      this._to = this.to.list[this._i];
      this._connection = this._from.project(this._to, weights);

      this.connections[this._connection.ID] = this._connection;
      this.size = this.list.push(this._connection);
    }
  }

  static uid () {
    return connections++;
  }
}