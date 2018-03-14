import Network from '../Network';
import Layer from '../Layer';

export default class Perceptron extends Network {
  constructor() {
    super();
    this.args = Array.prototype.slice.call(arguments); // convert arguments to Array
    if (this.args.length < 3)
      throw new Error('not enough layers (minimum 3) !!');

    this._inputs = this.args.shift(); // first argument
    this._outputs = this.args.pop(); // last argument
    this._layers = this.args; // all the arguments in the middle

    this._input = new Layer(this._inputs);
    this._hidden = [];
    this._output = new Layer(this._outputs);

    this._previous = this._input;

    this.generateHiddenLayers();

    this._previous.project(this._output);

    // set layers of the neural network
    this.set({
      input: this._input,
      hidden: this._hidden,
      output: this._output
    });
  }

  // generate hidden layers
  generateHiddenLayers() {
    for (this._i in this._layers) {
      this._size = this._layers[this._i];
      this._layer = new Layer(this._size);
      this._hidden.push(this._layer);
      this._previous.project(this._layer);
      this._previous = this._layer;
    }
  }
}