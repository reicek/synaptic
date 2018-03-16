/*!
 * The MIT License (MIT)
 * 
 * Copyright (c) 2018 Juan Cazala - https://caza.la
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE
 * 
 * 
 * 
 * ********************************************************************************************
 *                                   SYNAPTIC (v1.1.4)
 * ********************************************************************************************
 * 
 * Synaptic is a javascript neural network library for node.js and the browser, its generalized
 * algorithm is architecture-free, so you can build and train basically any type of first order
 * or even second order neural network architectures.
 * 
 * http://en.wikipedia.org/wiki/Recurrent_neural_network#Second_Order_Recurrent_Neural_Network
 * 
 * The library includes a few built-in architectures like multilayer perceptrons, multilayer
 * long-short term memory networks (LSTM) or liquid state machines, and a trainer capable of
 * training any given network, and includes built-in training tasks/tests like solving an XOR,
 * passing a Distracted Sequence Recall test or an Embeded Reber Grammar test.
 * 
 * The algorithm implemented by this library has been taken from Derek D. Monner's paper:
 * 
 * 
 * A generalized LSTM-like training algorithm for second-order recurrent neural networks
 * http://www.overcomplete.net/papers/nn2012.pdf
 * 
 * There are references to the equations in that paper commented through the source code.
 * 
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["synaptic"] = factory();
	else
		root["synaptic"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _LayerConnection = __webpack_require__(6);

var _LayerConnection2 = _interopRequireDefault(_LayerConnection);

var _Neuron = __webpack_require__(2);

var _Neuron2 = _interopRequireDefault(_Neuron);

var _Network = __webpack_require__(1);

var _Network2 = _interopRequireDefault(_Network);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Layer = function () {
  function Layer(size) {
    _classCallCheck(this, Layer);

    this.size = size | 0;
    this.list = [];

    this.connectedTo = [];

    while (size--) {
      this._neuron = new _Neuron2.default();
      this.list.push(this._neuron);
    }
  }

  // types of connections


  // types of gates


  _createClass(Layer, [{
    key: 'activate',


    // activates all the neurons in the layer
    value: function activate(input) {
      this._activations = [];

      if (typeof input != 'undefined') {
        if (input.length != this.size) throw new Error('INPUT size and LAYER size must be the same to activate!');

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

  }, {
    key: 'propagate',
    value: function propagate(rate, target) {
      if (typeof target != 'undefined') {
        if (target.length != this.size) throw new Error('TARGET size and LAYER size must be the same to propagate!');

        for (this._i = this.list.length - 1; this._i >= 0; this._i--) {
          this.list[this._i].propagate(rate, target[this._i]);
        }
      } else for (this._i = this.list.length - 1; this._i >= 0; this._i--) {
        this.list[this._i].propagate(rate);
      }
    }

    // projects a connection from this layer to another one

  }, {
    key: 'project',
    value: function project(layer, type, weights) {

      if (layer instanceof _Network2.default) layer = layer.layers.input;

      if (layer instanceof Layer) {
        if (!this.connected(layer)) return new _LayerConnection2.default(this, layer, type, weights);
      } else throw new Error('Invalid argument, you can only project connections to LAYERS and NETWORKS!');
    }

    // gates a connection betwenn two layers

  }, {
    key: 'gate',
    value: function gate(connection, type) {
      switch (true) {
        case type == Layer.gateType.INPUT:
          if (connection.to.size != this.size) throw new Error('GATER layer and CONNECTION.TO layer must be the same size in order to gate!');

          for (this._i in connection.to.list) {
            this._neuron = connection.to.list[this._i];

            for (this._j in this._neuron.connections.inputs) {
              this._gated = this._neuron.connections.inputs[this._j];

              if (this._gated.ID in connection.connections) this.list[this._i].gate(this._gated);
            }
          }
          break;

        case type == Layer.gateType.OUTPUT:
          if (connection.from.size != this.size) throw new Error('GATER layer and CONNECTION.FROM layer must be the same size in order to gate!');

          for (this._i in connection.from.list) {
            this._neuron = connection.from.list[this._i];

            for (this._j in this._neuron.connections.projected) {
              this._gated = this._neuron.connections.projected[this._j];

              if (this._gated.ID in connection.connections) this.list[this._i].gate(this._gated);
            }
          }
          break;

        case type == Layer.gateType.ONE_TO_ONE:
          if (connection.size != this.size) throw new Error('The number of GATER UNITS must be the same as the number of CONNECTIONS to gate!');

          for (this._i in connection.list) {
            this.list[this._i].gate(connection.list[this._i]);
          }break;
      }

      connection.gatedfrom.push({ layer: this, type: type });
    }

    // true or false whether the whole layer is self-connected or not

  }, {
    key: 'selfconnected',
    value: function selfconnected() {
      for (this._i in this.list) {
        this._neuron = this.list[this._i];

        if (!this._neuron.selfconnected()) return false;
      }

      return true;
    }

    // true of false whether the layer is connected to another layer (parameter) or not

  }, {
    key: 'connected',
    value: function connected(layer) {
      switch (true) {
        case this.countAllToAll(layer) == this.size * layer.size:
          return Layer.connectionType.ALL_TO_ALL;

        case this.countOneToOne(layer) == this.size:
          return Layer.connectionType.ONE_TO_ONE;
      }
    }

    // Check if ALL to ALL connection

  }, {
    key: 'countAllToAll',
    value: function countAllToAll(layer) {
      this._connections = 0;

      for (this._i in this.list) {
        for (this._j in layer.list) {
          this._connected = this.list[this._i].connected(layer.list[this._j]);

          if (this._connected.type == 'projected') this._connections++;
        }
      }

      return this._connections;
    }

    // Check if ONE to ONE connection

  }, {
    key: 'countOneToOne',
    value: function countOneToOne(layer) {
      this._connections = 0;

      for (this._i in this.list) {
        this._connected = this.list[this._i].connected(layer.list[this._i]);

        if (this._connected.type == 'projected') this._connections++;
      }
    }

    // clears all the neuorns in the layer

  }, {
    key: 'clear',
    value: function clear() {
      for (this._i in this.list) {
        this.list[this._i].clear();
      }
    }

    // resets all the neurons in the layer

  }, {
    key: 'reset',
    value: function reset() {
      for (this._i in this.list) {
        this.list[this._i].reset();
      }
    }

    // returns all the neurons in the layer (array)

  }, {
    key: 'neurons',
    value: function neurons() {
      return this.list;
    }

    // adds a neuron to the layer

  }, {
    key: 'add',
    value: function add() {
      var neuron = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new _Neuron2.default();

      this.list.push(neuron);
      this.size++;
    }
  }, {
    key: 'set',
    value: function set() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      for (this._i in this.list) {
        this._neuron = this.list[this._i];

        if (options.label) this._neuron.label = options.label + '_' + this._neuron.ID;

        if (options.squash) this._neuron.squash = options.squash;

        if (options.bias) this._neuron.bias = options.bias;
      }

      return this;
    }
  }]);

  return Layer;
}();

Layer.connectionType = {
  ALL_TO_ALL: "ALL TO ALL",
  ONE_TO_ONE: "ONE TO ONE",
  ALL_TO_ELSE: "ALL TO ELSE"
};
Layer.gateType = {
  INPUT: "INPUT",
  OUTPUT: "OUTPUT",
  ONE_TO_ONE: "ONE TO ONE"
};
exports.default = Layer;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Neuron = __webpack_require__(2);

var _Neuron2 = _interopRequireDefault(_Neuron);

var _Layer = __webpack_require__(0);

var _Layer2 = _interopRequireDefault(_Layer);

var _Trainer = __webpack_require__(3);

var _Trainer2 = _interopRequireDefault(_Trainer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Network = function () {
  function Network(layers) {
    _classCallCheck(this, Network);

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


  _createClass(Network, [{
    key: 'activate',
    value: function activate(input) {
      if (this.optimized === false) {
        this.layers.input.activate(input);

        for (this._i in this.layers.hidden) {
          this.layers.hidden[this._i].activate();
        }return this.layers.output.activate();
      } else {
        if (this.optimized == null) this.optimize();

        return this.optimized.activate(input);
      }
    }

    // back-propagate the error thru the network

  }, {
    key: 'propagate',
    value: function propagate(rate, target) {
      if (this.optimized === false) {
        this.layers.output.propagate(rate, target);

        this._i = this.layers.hidden.length;
        while (this._i--) {
          this.layers.hidden[this._i].propagate(rate);
        }
      } else {
        if (this.optimized == null) this.optimize();

        this.optimized.propagate(rate, target);
      }
    }

    // project a connection to another unit (either a network or a layer)

  }, {
    key: 'project',
    value: function project(unit, type, weights) {
      if (this.optimized) this.optimized.reset();

      switch (true) {
        case unit instanceof Network:
          return this.layers.output.project(unit.layers.input, type, weights);

        case unit instanceof _Layer2.default:
          return this.layers.output.project(unit, type, weights);

        default:
          throw new Error('Invalid argument, you can only project connections to LAYERS and NETWORKS!');
      }
    }

    // let this network gate a connection

  }, {
    key: 'gate',
    value: function gate(connection, type) {
      if (this.optimized) this.optimized.reset();

      this.layers.output.gate(connection, type);
    }

    // clear all elegibility traces and extended elegibility traces (the network forgets its context, but not what was trained)

  }, {
    key: 'clear',
    value: function clear() {
      this.restore();
      this.layers.input.clear();

      for (this._i in this.layers.hidden) {
        this.layers.hidden[this._i].clear();
      }this.layers.output.clear();

      if (this.optimized) this.optimized.reset();
    }

    // reset all weights and clear all traces (ends up like a new network)

  }, {
    key: 'reset',
    value: function reset() {
      this.restore();
      this.layers.input.reset();

      for (this._i in this.layers.hidden) {
        this.layers.hidden[i].reset();
      }

      this.layers.output.reset();

      if (this.optimized) this.optimized.reset();
    }

    // hardcodes the behaviour of the whole network into a single optimized function

  }, {
    key: 'optimize',
    value: function optimize() {
      var _this = this;

      this._optimized = {};
      this._neurons = this.neurons();

      for (this._i in this._neurons) {
        this._neuron = this._neurons[this._i].neuron;
        this._layer = this._neurons[this._i].layer;

        while (this._neuron.neuron) {
          this._neuron = this._neuron.neuron;
        }this._optimized = this._neuron.optimize(this._optimized, this._layer);
      }

      for (this._i in this._optimized.propagation_sentences) {
        this._optimized.propagation_sentences[this._i].reverse();
      }this._optimized.propagation_sentences.reverse();

      this._hardcode = '';
      this._hardcode += 'const F = Float64Array ? new Float64Array(' + this._optimized.memory + ') : []; ';

      for (this._i in this._optimized.variables) {
        this._hardcode += 'F[' + this._optimized.variables[this._i].id + '] = ' + (this._optimized.variables[this._i].value || 0) + '; ';
      }this._hardcode += 'this._activate = input => {\n';

      for (this._i in this._optimized.inputs) {
        this._hardcode += 'F[' + this._optimized.inputs[this._i] + '] = input[' + this._i + ']; ';
      }for (this._i in this._optimized.activation_sentences) {
        if (this._optimized.activation_sentences[this._i].length > 0) {
          for (this._j in this._optimized.activation_sentences[this._i]) {
            this._hardcode += this._optimized.activation_sentences[this._i][this._j].join(' ');
            this._hardcode += this._optimized.trace_sentences[this._i][this._j].join(' ');
          }
        }
      }

      this._hardcode += ' this._output = []; ';

      for (this._i in this._optimized.outputs) {
        this._hardcode += 'this._output[' + this._i + '] = F[' + this._optimized.outputs[this._i] + ']; ';
      }this._hardcode += 'return this._output; }; ';
      this._hardcode += 'this._propagate = (rate, target) => {\n';
      this._hardcode += 'F[' + this._optimized.variables.rate.id + '] = rate; ';

      for (var _ref in this._optimized.targets) {
        var _ref2 = _ref;
        this._i = _ref2 === undefined ? 0 : _ref2;

        this._hardcode += 'F[' + this._optimized.targets[this._i] + '] = target[' + this._i + ']; ';
      }for (this._i in this._optimized.propagation_sentences) {
        for (this._j in this._optimized.propagation_sentences[this._i]) {
          this._hardcode += this._optimized.propagation_sentences[this._i][this._j].join(' ') + ' ';
        }
      }this._hardcode += ' };\n';
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
      };

      this._network.reset = function () {
        if (_this.optimized) {
          _this.optimized = null;
          _this.activate = _this._network.data.check_activation;
          _this.propagate = _this._network.data.check_propagation;
        }
      };

      this.optimized = this._network;
      this.activate = this._network.activate;
      this.propagate = this._network.propagate;
    }

    // restores all the values from the optimized network the their respective objects in order to manipulate the network

  }, {
    key: 'restore',
    value: function restore() {
      if (!this.optimized) return;

      this._optimized = this.optimized;

      this._list = this.neurons();

      // link id's to positions in the array
      for (this._i in this._list) {
        this._neuron = list[this._i].neuron;

        while (this._neuron.neuron) {
          this._neuron = this._neuron.neuron;
        }this._neuron.state = this.getValue(this._neuron, 'state');
        this._neuron.old = this.getValue(this._neuron, 'old');
        this._neuron.activation = this.getValue(this._neuron, 'activation');
        this._neuron.bias = this.getValue(this._neuron, 'bias');

        for (this._input in this._neuron.trace.elegibility) {
          this._neuron.trace.elegibility[this._input] = this.getValue(this._neuron, 'trace', 'elegibility', this._input);
        }for (this._gated in this._neuron.trace.extended) {
          for (this._input in this._neuron.trace.extended[this._gated]) {
            this._neuron.trace.extended[this._gated][this._input] = this.getValue(this._neuron, 'trace', 'extended', this._gated, this._input);
          }
        } // get connections
        for (this._j in this._neuron.connections.projected) {
          this._connection = this._neuron.connections.projected[this._j];
          this._connection.weight = this.getValue(this._connection, 'weight');
          this._connection.gain = this.getValue(this._connection, 'gain');
        }
      }
    }
  }, {
    key: 'getValue',
    value: function getValue() {
      this._args = Array.prototype.slice.call(arguments);

      this._unit = this._args.shift();
      this._prop = this._args.pop();

      this._id = this._prop + '_';

      for (this._property in this._args) {
        this._id += this._args[this._property] + '_';
      }this._id += this._unit.ID;

      if (this._id in this._optimized.data.variables) return this._optimized.memory[this._optimized.data.variables[this._id].id];else return 0;
    }

    // returns all the neurons in the network

  }, {
    key: 'neurons',
    value: function neurons() {
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

        for (this._j in this._hiddenLayer) {
          this._neurons.push({
            neuron: this._hiddenLayer[this._j],
            layer: this._i
          });
        }
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

  }, {
    key: 'inputs',
    value: function inputs() {
      return this.layers.input.size;
    }

    // returns number of outputs of hte network

  }, {
    key: 'outputs',
    value: function outputs() {
      return this.layers.output.size;
    }

    // sets the layers of the network

  }, {
    key: 'set',
    value: function set(layers) {
      this.layers = {
        input: layers.input || null,
        hidden: layers.hidden || [],
        output: layers.output || null
      };

      if (this.optimized) this.optimized.reset();
    }
  }, {
    key: 'setOptimize',
    value: function setOptimize(bool) {
      this.restore();

      if (this.optimized) this.optimized.reset();

      this.optimized = bool ? null : false;
    }

    // returns a json that represents all the neurons and connections of the network

  }, {
    key: 'toJSON',
    value: function toJSON(ignoreTraces) {
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

        this._copy.squash = this._neuron.squash == this._neuron.squash.LOGISTIC ? 'LOGISTIC' : this._neuron.squash == this._neuron.squash.TANH ? 'TANH' : this._neuron.squash == this._neuron.squash.IDENTITY ? 'IDENTITY' : this._neuron.squash == this._neuron.squash.HLIM ? 'HLIM' : this._neuron.squash == this._neuron.squash.RELU ? 'RELU' : null;

        this._neurons.push(this._copy);
      }

      for (this._i in this._list) {
        this._neuron = this._list[this._i].neuron;

        while (this._neuron.neuron) {
          this._neuron = this._neuron.neuron;
        }for (this._j in this._neuron.connections.projected) {
          this._connection = this._neuron.connections.projected[this._j];

          this._connections.push({
            from: this._ids[this._connection.from.ID],
            to: this._ids[this._connection.to.ID],
            weight: this._connection.weight,
            gater: this._connection.gater ? this._ids[this._connection.gater.ID] : null
          });
        }

        if (this._neuron.selfconnected()) {
          this._connections.push({
            from: this._ids[this._neuron.ID],
            to: this._ids[this._neuron.ID],
            weight: this._neuron.selfconnection.weight,
            gater: this._neuron.selfconnection.gater ? this._ids[this._neuron.selfconnection.gater.ID] : null
          });
        }
      }

      return {
        neurons: this._neurons,
        connections: this._connections
      };
    }

    // export the topology into dot language which can be visualized as graphs using dot
    /* example: ... console.log(net.toDotLang());
                $ node example.js > example.dot
                $ dot example.dot -Tpng > out.png
    */

  }, {
    key: 'toDot',
    value: function toDot(edgeConnection) {
      if (!(typeof edgeConnection === 'undefined' ? 'undefined' : _typeof(edgeConnection))) edgeConnection = false;

      this._code = 'digraph nn {\n    rankdir = BT\n';

      this._layers = [this.layers.input].concat(this.layers.hidden, this.layers.output);

      for (this._i in this._layers) {
        for (this._j in this._[this._i].connectedTo) {
          // projections
          this._connection = this._layers[this._i].connectedTo[this._j];
          this._layerToID = this._layers.indexOf(this._connection.to);

          /* http://stackoverflow.com/questions/26845540/connect-edges-with-graph-dot
           * DOT does not support edge-to-edge connections
           * This workaround produces somewhat weird graphs ...
          */
          if (!!edgeConnection) {
            if (!!this._connection.gatedfrom.length) {
              this._connection.sizefakeNode = 'fake' + this._i + '_' + this._layerToID;
              this._code += '    ' + this._connection.sizefakeNode + ' [label = "", shape = point, width = 0.01, height = 0.01]\n';
              this._code += '    ' + this._i + ' -> ' + this._connection.sizefakeNode + ' [label = ' + this._connection.size + ', arrowhead = none]\n';
              this._code += '    ' + this._connection.sizefakeNode + ' -> ' + this._layerToID + '\n';
            } else this._code += '    ' + this._i + ' -> ' + this._layerToID + ' [label = ' + this._connection.size + ']\n';

            for (this._from in this._connection.gatedfrom) {
              // gatings
              this._layerfrom = this._connection.gatedfrom[this._from].layer;
              this._layerfromID = layers.indexOf(this._layerfrom);
              this._code += '    ' + this._layerfromID + ' -> ' + this._connection.sizefakeNode + ' [color = blue]\n';
            }
          } else {
            this._code += '    ' + this._i + ' -> ' + this._layerToID + ' [label = ' + this._connection.size + ']\n';

            for (this._from in this._connection.gatedfrom) {
              // gatings
              this._layerfrom = this._connection.gatedfrom[this._from].layer;
              this._layerfromID = layers.indexOf(this._layerfrom);
              this._code += '    ' + this._layerfromID + ' -> ' + this._layerToID + ' [color = blue]\n';
            }
          }
        }
      }
      this._code += '}\n';

      return {
        code: this._code,
        link: 'https://chart.googleapis.com/chart?chl=' + escape(code.replace('/ /g', '+')) + '&cht=gv'
      };
    }

    // returns a function that works as the activation of the network and can be used without depending on the library

  }, {
    key: 'standalone',
    value: function standalone() {
      var _this2 = this;

      if (!this.optimized) this.optimize();

      this._data = this.optimized.data;

      // build activation function
      this._activation = 'input => {\n';

      // build inputs
      for (this._i in this._data.inputs) {
        this._activation += 'F[' + this._data.inputs[this._i] + '] = input[' + this._i + '];\n';
      } // build network activation
      for (this._i in this._data.activate) {
        // shouldn't this be layer?
        for (this._j in this._data.activate[this._i]) {
          this._activation += this._data.activate[this._i][this._j].join('') + '\n';
        }
      }

      // build outputs
      this._activation += 'const output = [];\n';

      for (this._i in this._data.outputs) {
        this._activation += 'output[${this._i}] = F[${this._data.outputs[this._i]}];\n';
      }this._activation += 'return output;\n}';

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

      for (this._i in this._ids) {
        this._hardcode += this._ids[this._i] + ': ' + this.optimized.memory[this._i] + ',\n';
      }this._hardcode = this._hardcode.substring(0, this._hardcode.length - 2) + '\n};\n';
      this._hardcode = 'const run = ';
      this._hardcode += this._activation.replace(/F\[(\d+)]/g, function (index) {
        return 'F[' + _this2._ids[index.match(/\d+/)[0]] + ']';
      }).replace('{\n', '{\n' + this._hardcode) + ';\n';

      this._hardcode += 'return run';

      // return standalone function
      return new Function(this._hardcode)();
    }

    // Return a HTML5 WebWorker specialized on training the network stored in `memory`.
    // Train based on the given dataSet and options.
    // The worker returns the updated `memory` when done.

  }, {
    key: 'worker',
    value: function worker(memory, set, options) {
      // Copy the options and set defaults (options might be different for each worker)
      this._workerOptions = {};

      if (options) this._workerOptions = options;

      this._workerOptions.rate = this._workerOptions.rate || .2;
      this._workerOptions.iterations = this._workerOptions.iterations || 100000;
      this._workerOptions.error = this._workerOptions.error || .005;
      this._workerOptions.cost = this._workerOptions.cost || null;
      this._workerOptions.crossValidate = this._workerOptions.crossValidate || null;

      // Cost function might be different for each worker
      this._costFunction = '// REPLACED BY WORKER\nvar cost = ' + (options && options.cost || this.cost || _Trainer2.default.cost.MSE) + ';\n';
      this._workerFunction = Network.getWorkerSharedFunctions();
      this._workerFunction = this._workerFunction.replace(/const cost = options && options\.cost \|\| this\.cost \|\| Trainer\.cost\.MSE;/g, this._costFunction);

      // Set what we do when training is finished
      this._workerFunction = this._workerFunction.replace('return results;', 'postMessage({action: "done", message: results, memoryBuffer: F}, [F.buffer]);');

      // Replace log with postmessage
      this._workerFunction = this._workerFunction.replace('console.log(\'iterations\', iterations, \'error\', error, \'rate\', currentRate)', 'postMessage({action: \'log\', message: {\n' + 'iterations: iterations,\n' + 'error: error,\n' + 'rate: currentRate\n' + '}\n' + '})');

      // Replace schedule with postmessage
      this._workerFunction = this._workerFunction.replace('abort = this.schedule.do({ error: error, iterations: iterations, rate: currentRate })', 'postMessage({action: \'schedule\', message: {\n' + 'iterations: iterations,\n' + 'error: error,\n' + 'rate: currentRate\n' + '}\n' + '})');

      if (!this.optimized) this.optimize();

      this._hardcode = 'const inputs = ' + this.optimized.data.inputs.length + ';\n';
      this._hardcode += 'const outputs = ' + this.optimized.data.outputs.length + ';\n';
      this._hardcode += 'const F =  new Float64Array([' + this.optimized.memory.toString() + ']);\n';
      this._hardcode += 'const activate = ' + this.optimized.activate.toString() + ';\n';
      this._hardcode += 'const propagate = ' + this.optimized.propagate.toString() + ';\n';
      this._hardcode += 'onmessage = e => {\n' + 'if (e.data.action == \'startTraining\') {\n' + ('train(' + JSON.stringify(set) + ',' + JSON.stringify(this._workerOptions) + ');\n') + '}\n' + '}';

      this._workerSourceCode = this._workerFunction + '\n' + this._hardcode;
      this._blob = new Blob([this._workerSourceCode]);
      this._blobURL = window.URL.createObjectURL(this._blob);

      return new Worker(this._blobURL);
    }

    // returns a copy of the network

  }, {
    key: 'clone',
    value: function clone() {
      return Network.fromJSON(this.toJSON());
    }

    /**
     * Creates a static String to store the source code of the functions
     *  that are identical for all the workers (train, _trainSet, test)
     *
     * @return {String} Source code that can train a network inside a worker.
     * @static
     */

  }], [{
    key: 'getWorkerSharedFunctions',
    value: function getWorkerSharedFunctions() {
      // If we already computed the source code for the shared functions
      if (typeof Network._SHARED_WORKER_FUNCTIONS !== 'undefined') return Network._SHARED_WORKER_FUNCTIONS;

      // Otherwise compute and return the source code
      // We compute them by simply copying the source code of the train, _trainSet and test functions
      //  using the .toString() method

      // Load and name the train function
      this._train_f = _Trainer2.default.prototype.train.toString();
      this._train_f = this._train_f.replace(/this._trainSet/g, '_trainSet');
      this._train_f = this._train_f.replace(/this.test/g, 'test');
      this._train_f = this._train_f.replace(/this.crossValidate/g, 'crossValidate');
      this._train_f = this._train_f.replace('crossValidate = true', '// REMOVED BY WORKER');

      // Load and name the _trainSet function
      this._trainSet_f = _Trainer2.default.prototype._trainSet.toString().replace(/this.network./g, '');

      // Load and name the test function
      this._test_f = _Trainer2.default.prototype.test.toString().replace(/this.network./g, '');

      return Network._SHARED_WORKER_FUNCTIONS = this._train_f + '\n' + this._trainSet_f + '\n' + this._test_f;
    }
  }, {
    key: 'fromJSON',
    value: function fromJSON(json) {
      this._neurons = [];

      this._layers = {
        input: new _Layer2.default(),
        hidden: [],
        output: new _Layer2.default()
      };

      for (this._i in json.neurons) {
        this._config = json.neurons[this._i];

        this._neuron = new _Neuron2.default();
        this._neuron.trace.elegibility = {};
        this._neuron.trace.extended = {};
        this._neuron.state = this._config.state;
        this._neuron.old = this._config.old;
        this._neuron.activation = this._config.activation;
        this._neuron.bias = this._config.bias;
        this._neuron.squash = this._config.squash in _Neuron2.default.squash ? _Neuron2.default.squash[this._config.squash] : _Neuron2.default.squash.LOGISTIC;
        this._neurons.push(this._neuron);

        switch (true) {
          case this._config.layer === 'input':
            this._layers.input.add(this._neuron);
            break;

          case this._config.layer === 'output':
            this._layers.output.add(this._neuron);
            break;

          default:
            if (typeof this._layers.hidden[this._config.layer] === 'undefined') this._layers.hidden[this._config.layer] = new _Layer2.default();

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

        if (this._gater) this._gater.gate(this._connection);
      }

      return new Network(this._layers);
    }
  }]);

  return Network;
}();

exports.default = Network;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Connection = __webpack_require__(5);

var _Connection2 = _interopRequireDefault(_Connection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var neurons = 0;

var Neuron = function () {
  function Neuron() {
    _classCallCheck(this, Neuron);

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
    this.selfconnection = new _Connection2.default(this, this, 0); // weight = 0 -> not connected
    this.squash = Neuron.squash.LOGISTIC;
    this.neighboors = {};
    this.bias = Math.random() * .2 - .1;
  }

  // activate the neuron


  _createClass(Neuron, [{
    key: 'activate',
    value: function activate(input) {
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
      this.state = this.selfconnection.gain * this.selfconnection.weight * this.state + this.bias;

      for (this._i in this.connections.inputs) {
        this._input = this.connections.inputs[this._i];
        this.state += this._input.from.activation * this._input.weight * this._input.gain;
      }

      // eq. 16
      this.activation = this.squash(this.state);

      // f'(s)
      this.derivative = this.squash(this.state, true);
      this.updateInfluences();

      //  update gated connection's gains
      for (this._i in this.connections.gated) {
        this.connections.gated[this._i].gain = this.activation;
      }return this.activation;
    }

    // update traces

  }, {
    key: 'updateInfluences',
    value: function updateInfluences() {
      this._influences = [];
      for (this._i in this.trace.extended) {
        // extended elegibility trace
        this._neuron = this.neighboors[this._i];

        // if gated neuron's selfconnection is gated by this unit, the influence keeps track of the neuron's old state
        this._influence = this._neuron.selfconnection.gater == this ? this._neuron.old : 0;

        // index runs over all the incoming connections to the gated neuron that are gated by this unit
        for (this._j in this.trace.influences[this._neuron.ID]) {
          // captures the effect that has an input connection to this unit, on a neuron that is gated by this unit
          this._influence += this.trace.influences[this._neuron.ID][this._j].weight * this.trace.influences[this._neuron.ID][this._j].from.activation;
        }this._influences[this._neuron.ID] = this._influence;
      }

      for (this._i in this.connections.inputs) {
        this._input = this.connections.inputs[this._i];

        // elegibility trace - Eq. 17
        this.trace.elegibility[this._input.ID] = this.selfconnection.gain * this.selfconnection.weight * this.trace.elegibility[this._input.ID] + this._input.gain * this._input.from.activation;

        for (this._j in this.trace.extended) {
          // extended elegibility trace
          this._xtrace = this.trace.extended[this._j];
          this._neuron = this.neighboors[this._j];
          this._influence = this._influences[this._neuron.ID];

          // eq. 18
          this._xtrace[this._input.ID] = this._neuron.selfconnection.gain * this._neuron.selfconnection.weight * this._xtrace[this._input.ID] + this.derivative * this.trace.elegibility[this._input.ID] * this._influence;
        }
      }
    }

    // back-propagate the error

  }, {
    key: 'propagate',
    value: function propagate(rate, target) {
      // error accumulator
      this._errorCount = 0;

      // output neurons get their error from the enviroment
      if (typeof target != 'undefined') // whether or not this neuron is in the output layer
        this.error.responsibility = this.error.projected = target - this.activation; // Eq. 10
      else {
          // the rest of the neuron compute their error responsibilities by backpropagation
          // error responsibilities from all the connections projected from this neuron
          for (this._i in this.connections.projected) {
            this._connection = this.connections.projected[this._i];
            this._neuron = this._connection.to;
            // Eq. 21
            this._errorCount += this._neuron.error.responsibility * this._connection.gain * this._connection.weight;
          }

          // projected error responsibility
          this.error.projected = this.derivative * this._errorCount;

          this._errorCount = 0;
          // error responsibilities from all the connections gated by this neuron
          for (this._i in this.trace.extended) {
            this._neuron = this.neighboors[this._i]; // gated neuron
            this._influence = this._neuron.selfconnection.gater == this ? this._neuron.old : 0; // if gated neuron's selfconnection is gated by this neuron

            // index runs over all the connections to the gated neuron that are gated by this neuron
            for (this._input in this.trace.influences[this._i]) {
              // captures the effect that the input connection of this neuron have, on a neuron which its input/s is/are gated by this neuron
              this._influence += this.trace.influences[this._i][this._input].weight * this.trace.influences[this._neuron.ID][this._input].from.activation;
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
      rate = this.adjustIncomingConnections(rate);

      // adjust bias
      this.bias += rate * this.error.responsibility;
    }

    // adjust all the neuron's incoming connections

  }, {
    key: 'adjustIncomingConnections',
    value: function adjustIncomingConnections() {
      var rate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0.1;

      for (this._i in this.connections.inputs) {
        this._input = this.connections.inputs[this._i];

        // Eq. 24
        this._gradient = this.error.projected * this.trace.elegibility[this._input.ID];

        for (this._j in this.trace.extended) {
          this._neuron = this.neighboors[this._j];
          this._gradient += this._neuron.error.responsibility * this.trace.extended[this._neuron.ID][this._input.ID];
        }

        this._input.weight += rate * this._gradient; // adjust weights - aka learn
      }

      return rate;
    }
  }, {
    key: 'project',
    value: function project(neuron, weight) {
      // self-connection
      if (neuron == this) {
        this.selfconnection.weight = 1;
        return this.selfconnection;
      }

      // check if connection already exists
      this._connected = this.connected(neuron);
      if (this._connected && this._connected.type == 'projected') {
        // update connection
        if (typeof weight != 'undefined') this._connected.connection.weight = weight;
        // return existing connection
        return this._connected.connection;
      } else {
        // create a new connection
        this._connection = new _Connection2.default(this, neuron, weight);
      }

      // reference all the connections and traces
      this.connections.projected[this._connection.ID] = this._connection;
      this.neighboors[neuron.ID] = neuron;
      neuron.connections.inputs[this._connection.ID] = this._connection;
      neuron.trace.elegibility[this._connection.ID] = 0;

      for (this._i in neuron.trace.extended) {
        this._trace = neuron.trace.extended[this._i];
        this._trace[this._connection.ID] = 0;
      }

      return this._connection;
    }
  }, {
    key: 'gate',
    value: function gate(connection) {
      // add connection to gated list
      this.connections.gated[connection.ID] = connection;

      this._neuron = connection.to;
      if (!(this._neuron.ID in this.trace.extended)) {
        // extended trace
        this.neighboors[this._neuron.ID] = this._neuron;
        this._xtrace = this.trace.extended[this._neuron.ID] = {};

        for (this._i in this.connections.inputs) {
          this._input = this.connections.inputs[this._i];
          this._xtrace[this._input.ID] = 0;
        }
      }

      // keep track
      if (this._neuron.ID in this.trace.influences) this.trace.influences[this._neuron.ID].push(connection);else this.trace.influences[this._neuron.ID] = [connection];

      // set gater
      connection.gater = this;
    }

    // returns true or false whether the neuron is self-connected or not

  }, {
    key: 'selfconnected',
    value: function selfconnected() {
      return this.selfconnection.weight !== 0;
    }

    // returns true or false whether the neuron is connected to another neuron (parameter)

  }, {
    key: 'connected',
    value: function connected(neuron) {
      this._result = {
        type: null,
        connection: false
      };

      if (this == neuron) {
        if (this.selfconnected()) {
          this._result.type = 'selfconnection';
          this._result.connection = this.selfconnection;

          return this._result;
        } else return false;
      }

      for (this._i in this.connections) {
        for (this._j in this.connections[this._i]) {
          this._connection = this.connections[this._i][this._j];

          switch (true) {
            case this._connection.to == neuron:
              this._result.type = this._i;
              this._result.connection = this._connection;

              return this._result;

            case this._connection.from == neuron:
              this._result.type = this._i;
              this._result.connection = this._connection;

              return this._result;
          }
        }
      }

      return false;
    }

    // clears all the traces (the neuron forgets it's context, but the connections remain intact)

  }, {
    key: 'clear',
    value: function clear() {
      for (this._i in this.trace.elegibility) {
        this.trace.elegibility[this._i] = 0;
      }

      for (this._i in this.trace.extended) {
        for (this._j in this.trace.extended[this._i]) {
          this.trace.extended[this._i][this._j] = 0;
        }
      }

      this.error.responsibility = this.error.projected = this.error.gated = 0;
    }

    // all the connections are randomized and the traces are cleared

  }, {
    key: 'reset',
    value: function reset() {
      this.clear();

      for (this._i in this.connections) {
        for (this._j in this.connections[this._i]) {
          this.connections[this._i][this._j].weight = Math.random() * .2 - .1;
        }
      }

      this.bias = Math.random() * .2 - .1;
      this.old = this.state = this.activation = 0;
    }

    // hardcodes the behaviour of the neuron into an optimized function

  }, {
    key: 'optimize',
    value: function optimize(optimized, layer) {

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
      this._layers = optimized.layers || { __count: 0, __neuron: 0 };

      this.allocate(layer, this._activation_sentences);
      this.allocate(layer, this._trace_sentences);
      this.allocate(layer, this._propagation_sentences);
      this._currentLayer = this._layers.__count;

      // characteristics of the neuron
      this._noProjections = this.isEmpty(this.connections.projected);
      this._noGates = this.isEmpty(this.connections.gated);
      this._isInput = layer == 'input' ? true : this.isEmpty(this.connections.inputs);
      this._isOutput = layer == 'output' ? true : this._noProjections && this._noGates;

      // optimize neuron's behaviour
      this._rate = this.getVar('rate');
      this._activation = this.getVar(this, 'activation');
      if (this._isInput) this._inputs.push(this._activation.id);else {
        this._activation_sentences[this._currentLayer].push(this._store_activation);
        this._trace_sentences[this._currentLayer].push(this._store_trace);
        this._propagation_sentences[this._currentLayer].push(this._store_propagation);
        this._old = this.getVar(this, 'old');
        this._state = this.getVar(this, 'state');
        this._bias = this.getVar(this, 'bias');

        if (this.selfconnection.gater) this._self_gain = this.getVar(this.selfconnection, 'gain');

        if (this.selfconnected()) this._self_weight = this.getVar(this.selfconnection, 'weight');

        this.buildSentence(this._old, ' = ', this._state, this._store_activation);

        if (this.selfconnected()) {
          if (this.selfconnection.gater) this.buildSentence(this._state, ' = ', this._self_gain, ' * ', this._self_weight, ' * ', this._state, ' + ', this._bias, this._store_activation);else this.buildSentence(this._state, ' = ', this._self_weight, ' * ', this._, ' + ', this._bias, this._store_activation);
        } else this.buildSentence(this._state, ' = ', this._bias, this._store_activation);

        for (this._i in this.connections.inputs) {
          this._input = this.connections.inputs[this._i];
          this._input_activation = this.getVar(this._input.from, 'activation');
          this._input_weight = this.getVar(this._input, 'weight');

          if (this._input.gater) this._input_gain = this.getVar(this._input, 'gain');

          if (this.connections.inputs[this._i].gater) this.buildSentence(this._state, ' += ', this._input_activation, ' * ', this._input_weight, ' * ', this._input_gain, this._store_activation);else this.buildSentence(this._state, ' += ', this._input_activation, ' * ', this._input_weight, this._store_activation);
        }
        this._derivative = this.getVar(this, 'derivative');

        switch (this.squash) {
          case Neuron.squash.LOGISTIC:
            this.buildSentence(this._activation, ' = (1 / (1 + Math.exp(-', this._state, ')))', this._store_activation);
            this.buildSentence(this._derivative, ' = ', this._activation, ' * (1 - ', this._activation, ')', this._store_activation);
            break;

          case Neuron.squash.TANH:
            this._eP = this.getVar('aux');
            this._eN = this.getVar('aux_2');
            this.buildSentence(this._eP, ' = Math.exp(', this._state, ')', this._store_activation);
            this.buildSentence(this._eN, ' = 1 / ', this._eP, this._store_activation);
            this.buildSentence(this._activation, ' = (', this._eP, ' - ', this._eN, ') / (', this._eP, ' + ', this._eN, ')', this._store_activation);
            this.buildSentence(this._derivative, ' = 1 - (', this._activation, ' * ', this._activation, ')', this._store_activation);
            break;

          case Neuron.squash.IDENTITY:
            this.buildSentence(this._activation, ' = ', this._state, this._store_activation);
            this.buildSentence(this._derivative, ' = 1', this._store_activation);
            break;

          case Neuron.squash.HLIM:
            this.buildSentence(this._activation, ' = +(', this._state, ' > 0)', this._store_activation);
            this.buildSentence(this._derivative, ' = 1', this._store_activation);
            break;

          case Neuron.squash.RELU:
            this.buildSentence(this._activation, ' = ', this._state, ' > 0 ? ', this._state, ' : 0', this._store_activation);
            this.buildSentence(this._derivative, ' = ', this._state, ' > 0 ? 1 : 0', this._store_activation);
            break;
        }

        for (this._i in this.trace.extended) {
          // calculate extended elegibility traces in advance
          this._neuron = this.neighboors[this._i];
          this._influence = this.getVar('influences[' + this._neuron.ID + ']');
          this._neuron_old = this.getVar(this._neuron, 'old');
          this._initialized = false;

          if (this._neuron.selfconnection.gater == this) {
            this.buildSentence(this._influence, ' = ', this._neuron_old, this._store_trace);
            this._initialized = true;
          }

          for (this._j in this.trace.influences[this._neuron.ID]) {
            this._incoming_weight = this.getVar(this.trace.influences[this._neuron.ID][this._j], 'weight');
            this._incoming_activation = this.getVar(this.trace.influences[this._neuron.ID][this._j].from, 'activation');

            if (this._initialized) this.buildSentence(this._influence, ' += ', this._incoming_weight, ' * ', this._incoming_activation, this._store_trace);else {
              this.buildSentence(this._influence, ' = ', this._incoming_weight, ' * ', this._incoming_activation, this._store_trace);
              this._initialized = true;
            }
          }
        }

        for (this._i in this.connections.inputs) {
          this._input = this.connections.inputs[this._i];

          if (this._input.gater) this._input_gain = this.getVar(this._input, 'gain');

          this._input_activation = this.getVar(this._input.from, 'activation');
          this._trace = this.getVar(this, 'trace', 'elegibility', this._input.ID, this.trace.elegibility[this._input.ID]);

          if (this.selfconnected()) {
            if (this.selfconnection.gater) {
              if (this._input.gater) this.buildSentence(this._trace, ' = ', this._self_gain, ' * ', this._self_weight, ' * ', this._trace, ' + ', this._input_gain, ' * ', this._input_activation, this._store_trace);else this.buildSentence(this._trace, ' = ', this._self_gain, ' * ', this._self_weight, ' * ', this._trace, ' + ', this._input_activation, this._store_trace);
            } else {
              if (this._input.gater) this.buildSentence(this._trace, ' = ', this._self_weight, ' * ', this._trace, ' + ', this._input_gain, ' * ', this._input_activation, this._store_trace);else this.buildSentence(this._trace, ' = ', this._self_weight, ' * ', this._trace, ' + ', this._input_activation, this._store_trace);
            }
          } else {
            if (this._input.gater) this.buildSentence(this._trace, ' = ', this._input_gain, ' * ', this._input_activation, this._store_trace);else this.buildSentence(this._trace, ' = ', this._input_activation, this._store_trace);
          }
          for (this._j in this.trace.extended) {
            // extended elegibility trace
            this._neuron = this.neighboors[this._j];
            this._influence = this.getVar('influences[' + this._neuron.ID + ']');

            this._trace = this.getVar(this, 'trace', 'elegibility', this._input.ID, this.trace.elegibility[this._input.ID]);
            this._xtrace = this.getVar(this, 'trace', 'extended', this._neuron.ID, this._input.ID, this.trace.extended[this._neuron.ID][this._input.ID]);

            if (this._neuron.selfconnected()) this._neuron_self_weight = this.getVar(this._neuron.selfconnection, 'weight');

            if (this._neuron.selfconnection.gater) this._neuron_self_gain = this.getVar(this._neuron.selfconnection, 'gain');

            if (this._neuron.selfconnected()) {
              if (this._neuron.selfconnection.gater) this.buildSentence(this._xtrace, ' = ', this._neuron_self_gain, ' * ', this._neuron_self_weight, ' * ', this._xtrace, ' + ', this._derivative, ' * ', this._trace, ' * ', this._influence, this._store_trace);else this.buildSentence(this._xtrace, ' = ', this._neuron_self_weight, ' * ', this._xtrace, ' + ', this._derivative, ' * ', this._trace, ' * ', this._influence, this._store_trace);
            } else this.buildSentence(this._xtrace, ' = ', this._derivative, ' * ', this._trace, ' * ', this._influence, this._store_trace);
          }
        }
        for (this._i in this.connections.gated) {
          this._gated_gain = this.getVar(this.connections.gated[this._i], 'gain');
          this.buildSentence(this._gated_gain, ' = ', this._activation, this._store_activation);
        }
      }
      if (!this._isInput) {
        this._responsibility = this.getVar(this, 'error', 'responsibility', this.error.responsibility);
        if (this._isOutput) {
          this._target = this.getVar('target');
          this.buildSentence(this._responsibility, ' = ', this._target, ' - ', this._activation, this._store_propagation);
          for (this._i in this.connections.inputs) {
            this._input = this.connections.inputs[this._i];
            this._trace = this.getVar(this, 'trace', 'elegibility', this._input.ID, this.trace.elegibility[this._input.ID]);
            this._input_weight = this.getVar(this._input, 'weight');
            this.buildSentence(this._input_weight, ' += ', this._rate, ' * (', this._responsibility, ' * ', this._trace, ')', this._store_propagation);
          }
          this._outputs.push(this._activation.id);
        } else {
          if (!this._noProjections && !this._noGates) {
            this._error = this.getVar('aux');
            for (this._i in this.connections.projected) {
              this._connection = this.connections.projected[this._i];
              this._neuron = this._connection.to;
              this._connection_weight = this.getVar(this._connection, 'weight');
              this._neuron_responsibility = this.getVar(this._neuron, 'error', 'responsibility', this._neuron.error.responsibility);
              if (this._connection.gater) {
                this._connection_gain = this.getVar(this._connection, 'gain');
                this.buildSentence(this._error, ' += ', this._neuron_responsibility, ' * ', this._connection_gain, ' * ', this._connection_weight, this._store_propagation);
              } else this.buildSentence(this._error, ' += ', this._neuron_responsibility, ' * ', this._connection_weight, this._store_propagation);
            }
            this._projected = this.getVar(this, 'error', 'projected', this.error.projected);
            this.buildSentence(this._projected, ' = ', this._derivative, ' * ', this._error, this._store_propagation);
            this.buildSentence(this._error, ' = 0', this._store_propagation);

            for (this._i in this.trace.extended) {
              this._neuron = this.neighboors[this._i];
              this._influence = this.getVar('aux_2');
              this._neuron_old = this.getVar(this._neuron, 'old');

              if (this._neuron.selfconnection.gater == this) this.buildSentence(this._influence, ' = ', this._neuron_old, this._store_propagation);else this.buildSentence(this._influence, ' = 0', this._store_propagation);

              for (this._j in this.trace.influences[this._neuron.ID]) {
                this._connection = this.trace.influences[this._neuron.ID][this._j];
                this._connection_weight = this.getVar(this._connection, 'weight');
                this._neuron_activation = this.getVar(this._connection.from, 'activation');
                this.buildSentence(this._influence, ' += ', connection_weight, ' * ', this._neuron_activation, this._store_propagation);
              }

              this._neuron_responsibility = this.getVar(this._neuron, 'error', 'responsibility', this._neuron.error.responsibility);

              this.buildSentence(this._error, ' += ', this._neuron_responsibility, ' * ', this._influence, this._store_propagation);
            }
            this._gated = this.getVar(this, 'error', 'gated', this.error.gated);
            this.buildSentence(this._gated, ' = ', this._derivative, ' * ', this._error, this._store_propagation);
            this.buildSentence(this._responsibility, ' = ', this._projected, ' + ', this._gated, this._store_propagation);
            for (this._i in this.connections.inputs) {
              this._input = this.connections.inputs[this._i];
              this._gradient = this.getVar('aux');
              this._trace = this.getVar(this, 'trace', 'elegibility', this._input.ID, this.trace.elegibility[this._input.ID]);
              this.buildSentence(this._gradient, ' = ', this._projected, ' * ', this._trace, this._store_propagation);
              for (this._j in this.trace.extended) {
                this._neuron = this.neighboors[this._j];
                this._neuron_responsibility = this.getVar(this._neuron, 'error', 'responsibility', this._neuron.error.responsibility);
                this._xtrace = this.getVar(this, 'trace', 'extended', this._neuron.ID, this._input.ID, this.trace.extended[this._neuron.ID][this._input.ID]);
                this.buildSentence(this._gradient, ' += ', this._neuron_responsibility, ' * ', this._xtrace, this._store_propagation);
              }
              this._input_weight = this.getVar(this._input, 'weight');
              this.buildSentence(this._input_weight, ' += ', this._rate, ' * ', this._gradient, this._store_propagation);
            }
          } else if (this._noGates) {
            this.buildSentence(this._responsibility, ' = 0', this._store_propagation);
            for (this._i in this.connections.projected) {
              this._connection = this.connections.projected[this._i];
              this._neuron = this._connection.to;
              this._connection_weight = this.getVar(this._connection, 'weight');
              this._neuron_responsibility = this.getVar(this._neuron, 'error', 'responsibility', this._neuron.error.responsibility);

              if (this._connection.gater) {
                this._connection_gain = this.getVar(this._connection, 'gain');
                this.buildSentence(this._responsibility, ' += ', this._neuron_responsibility, ' * ', this._connection_gain, ' * ', this._connection_weight, this._store_propagation);
              } else this.buildSentence(this._responsibility, ' += ', this._neuron_responsibility, ' * ', this._connection_weight, this._store_propagation);
            }

            this.buildSentence(this._responsibility, ' *= ', this._derivative, this._store_propagation);

            for (this._i in this.connections.inputs) {
              this._input = this.connections.inputs[this._i];
              this._trace = this.getVar(this, 'trace', 'elegibility', this._input.ID, this.trace.elegibility[this._input.ID]);
              this._input_weight = this.getVar(this._input, 'weight');
              this.buildSentence(this._input_weight, ' += ', this._rate, ' * (', this._responsibility, ' * ', this._trace, ')', this._store_propagation);
            }
          } else if (this._noProjections) {
            this.buildSentence(this._responsibility, ' = 0', this._store_propagation);

            for (this._i in this.trace.extended) {
              this._neuron = this.neighboors[this._i];
              this._influence = this.getVar('aux');
              this._neuron_old = this.getVar(this._neuron, 'old');
              if (this._neuron.selfconnection.gater == this) this.buildSentence(this._influence, ' = ', this._neuron_old, this._store_propagation);else this.buildSentence(this._influence, ' = 0', this._store_propagation);
              for (this._j in this.trace.influences[this._neuron.ID]) {
                this._connection = this.trace.influences[this._neuron.ID][this._j];
                this._connection_weight = this.getVar(this._connection, 'weight');
                this._neuron_activation = this.getVar(this._connection.from, 'activation');
                this.buildSentence(this._influence, ' += ', this._connection_weight, ' * ', this._neuron_activation, this._store_propagation);
              }
              this._neuron_responsibility = this.getVar(this._neuron, 'error', 'responsibility', this._neuron.error.responsibility);
              this.buildSentence(this._responsibility, ' += ', this._neuron_responsibility, ' * ', this._influence, this._store_propagation);
            }
            this.buildSentence(this._responsibility, ' *= ', this._derivative, this._store_propagation);

            for (this._i in this.connections.inputs) {
              this._input = this.connections.inputs[this._i];
              this._gradient = this.getVar('aux');
              this.buildSentence(this._gradient, ' = 0', this._store_propagation);
              for (this._j in this.trace.extended) {
                this._neuron = this.neighboors[this._j];
                this._neuron_responsibility = this.getVar(this._neuron, 'error', 'responsibility', this._neuron.error.responsibility);
                this._xtrace = this.getVar(this, 'trace', 'extended', this._neuron.ID, this._input.ID, this.trace.extended[this._neuron.ID][this._input.ID]);
                this.buildSentence(this._gradient, ' += ', this._neuron_responsibility, ' * ', this._xtrace, this._store_propagation);
              }
              this._input_weight = this.getVar(this._input, 'weight');

              this.buildSentence(this._input_weight, ' += ', this._rate, ' * ', this._gradient, this._store_propagation);
            }
          }
        }
        this.buildSentence(this._bias, ' += ', this._rate, ' * ', this._responsibility, this._store_propagation);
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
        propagation_sentences: this._propagation_sentences
      };
    }

    // build sentence

  }, {
    key: 'buildSentence',
    value: function buildSentence() {
      this._args = Array.prototype.slice.call(arguments);
      this._store = this._args.pop();
      this._sentence = '';
      for (this._i = 0; this._i < this._args.length; this._i++) {
        if (typeof this._args[this._i] == 'string') this._sentence += this._args[this._i];else this._sentence += 'F[' + this._args[this._i].id + ']';
      }

      this._store.push(this._sentence + ';');
    }

    // allocate sentences

  }, {
    key: 'allocate',
    value: function allocate(layer, store) {
      this._allocated = layer in this._layers && store[this._layers.__count];
      if (!this._allocated) {
        this._layers.__count = store.push([]) - 1;
        this._layers[layer] = this._layers.__count;
      }
    }

    // get/reserve space in memory by creating a unique ID for a variablel

  }, {
    key: 'getVar',
    value: function getVar() {
      this._args = Array.prototype.slice.call(arguments);

      if (this._args.length === 1) {
        this._id = '';

        if (this._args[0] == 'target') {
          this._id = 'target_' + this._targets.length;
          this._targets.push(this._varID);
        } else this._id = this._args[0];

        if (this._id in this._variables) return this._variables[this._id];else return this._variables[this._id] = {
          value: 0,
          id: this._varID++
        };
      } else {
        this._extended = this._args.length > 2;
        if (this._extended) this._value = this._args.pop();

        this._unit = this._args.shift();
        this._prop = this._args.pop();

        if (!this._extended) this._value = this._unit[this._prop];

        this._id = this._prop + '_';

        for (this._i in this._args) {
          this._id += this._args[this._i] + '_';
        }this._id += this._unit.ID;

        if (this._id in this._variables) return this._variables[this._id];else return this._variables[this._id] = {
          value: this._value,
          id: this._varID++
        };
      }
    }

    // helper to check if an object is empty

  }, {
    key: 'isEmpty',
    value: function isEmpty(obj) {
      for (this._i in obj) {
        if (obj.hasOwnProperty(this._i)) return false;
      }

      return true;
    }
  }], [{
    key: 'uid',
    value: function uid() {
      return neurons++;
    }
  }, {
    key: 'quantity',
    value: function quantity() {
      return {
        neurons: neurons,
        connections: _Connection.connections
      };
    }
  }]);

  return Neuron;
}();

Neuron.squash = {
  // eq. 5 & 5'
  LOGISTIC: function LOGISTIC(x, derivate) {
    if (!derivate) return 1 / (1 + Math.exp(-x));else return 1 / (1 + Math.exp(-x)) * (1 - 1 / (1 + Math.exp(-x)));
  },

  TANH: function TANH(x, derivate) {
    if (derivate) return 1 - Math.pow(Math.tanh(x), 2);else return Math.tanh(x);
  },

  IDENTITY: function IDENTITY(x, derivate) {
    return derivate ? 1 : x;
  },

  HLIM: function HLIM(x, derivate) {
    return derivate ? 1 : x > 0 ? 1 : 0;
  },

  RELU: function RELU(x, derivate) {
    if (derivate) return x > 0 ? 1 : 0;else return x > 0 ? x : 0;
  }
};
exports.default = Neuron;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//+ Jonas Raoni Soares Silva
//@ http://jsfromhell.com/array/shuffle [v1.0]
function shuffleInplace(o) {
  //v1.0
  for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x) {}
  return o;
};

// Built-in cost functions
var cost = {
  // Eq. 9
  CROSS_ENTROPY: function CROSS_ENTROPY(target, output) {
    var crossentropy = 0;
    for (var i in output) {
      crossentropy -= target[i] * Math.log(output[i] + 1e-15) + (1 - target[i]) * Math.log(1 + 1e-15 - output[i]);
    } // +1e-15 is a tiny push away to avoid Math.log(0)
    return crossentropy;
  },
  MSE: function MSE(target, output) {
    var mse = 0;
    for (var i = 0; i < output.length; i++) {
      mse += Math.pow(target[i] - output[i], 2);
    }return mse / output.length;
  },
  BINARY: function BINARY(target, output) {
    var misses = 0;
    for (var i = 0; i < output.length; i++) {
      misses += Math.round(target[i] * 2) != Math.round(output[i] * 2);
    }return misses;
  }
};

var Trainer = function () {
  function Trainer(network, options) {
    _classCallCheck(this, Trainer);

    options = options || {};
    this.network = network;
    this.rate = options.rate || .2;
    this.iterations = options.iterations || 100000;
    this.error = options.error || .005;
    this.cost = options.cost || null;
    this.crossValidate = options.crossValidate || null;
  }

  // trains any given set to a network


  _createClass(Trainer, [{
    key: 'train',
    value: function train(set, options) {
      var error = 1;
      var iterations = bucketSize = 0;
      var abort = false;
      var currentRate;
      var cost = options && options.cost || this.cost || Trainer.cost.MSE;
      var crossValidate = false,
          testSet,
          trainSet;

      var start = Date.now();

      if (options) {
        if (options.iterations) this.iterations = options.iterations;
        if (options.error) this.error = options.error;
        if (options.rate) this.rate = options.rate;
        if (options.cost) this.cost = options.cost;
        if (options.schedule) this.schedule = options.schedule;
        if (options.customLog) {
          // for backward compatibility with code that used customLog
          console.log('Deprecated: use schedule instead of customLog');
          this.schedule = options.customLog;
        }
        if (this.crossValidate || options.crossValidate) {
          if (!this.crossValidate) this.crossValidate = {};
          crossValidate = true;
          if (options.crossValidate.testSize) this.crossValidate.testSize = options.crossValidate.testSize;
          if (options.crossValidate.testError) this.crossValidate.testError = options.crossValidate.testError;
        }
      }

      currentRate = this.rate;
      if (Array.isArray(this.rate)) {
        var bucketSize = Math.floor(this.iterations / this.rate.length);
      }

      if (crossValidate) {
        var numTrain = Math.ceil((1 - this.crossValidate.testSize) * set.length);
        trainSet = set.slice(0, numTrain);
        testSet = set.slice(numTrain);
      }

      var lastError = 0;
      while (!abort && iterations < this.iterations && error > this.error) {
        if (crossValidate && error <= this.crossValidate.testError) {
          break;
        }

        var currentSetSize = set.length;
        error = 0;
        iterations++;

        if (bucketSize > 0) {
          var currentBucket = Math.floor(iterations / bucketSize);
          currentRate = this.rate[currentBucket] || currentRate;
        }

        if (typeof this.rate === 'function') {
          currentRate = this.rate(iterations, lastError);
        }

        if (crossValidate) {
          this._trainSet(trainSet, currentRate, cost);
          error += this.test(testSet).error;
          currentSetSize = 1;
        } else {
          error += this._trainSet(set, currentRate, cost);
          currentSetSize = set.length;
        }

        // check error
        error /= currentSetSize;
        lastError = error;

        if (options) {
          if (this.schedule && this.schedule.every && iterations % this.schedule.every == 0) abort = this.schedule.do({ error: error, iterations: iterations, rate: currentRate });else if (options.log && iterations % options.log == 0) {
            console.log('iterations', iterations, 'error', error, 'rate', currentRate);
          }
          ;
          if (options.shuffle) shuffleInplace(set);
        }
      }

      var results = {
        error: error,
        iterations: iterations,
        time: Date.now() - start
      };

      return results;
    }

    // trains any given set to a network, using a WebWorker (only for the browser). Returns a Promise of the results.

  }, {
    key: 'trainAsync',
    value: function trainAsync(set, options) {
      var train = this.workerTrain.bind(this);
      return new Promise(function (resolve, reject) {
        try {
          train(set, resolve, options, true);
        } catch (e) {
          reject(e);
        }
      });
    }

    // preforms one training epoch and returns the error (private function used in this.train)

  }, {
    key: '_trainSet',
    value: function _trainSet(set, currentRate, costFunction) {
      var errorSum = 0;
      for (var i = 0; i < set.length; i++) {
        var input = set[i].input;
        var target = set[i].output;

        var output = this.network.activate(input);
        this.network.propagate(currentRate, target);

        errorSum += costFunction(target, output);
      }
      return errorSum;
    }

    // tests a set and returns the error and elapsed time

  }, {
    key: 'test',
    value: function test(set, options) {
      var error = 0;
      var input, output, target;
      var cost = options && options.cost || this.cost || Trainer.cost.MSE;

      var start = Date.now();

      for (var i = 0; i < set.length; i++) {
        input = set[i].input;
        target = set[i].output;
        output = this.network.activate(input);
        error += cost(target, output);
      }

      error /= set.length;

      var results = {
        error: error,
        time: Date.now() - start
      };

      return results;
    }

    // trains any given set to a network using a WebWorker [deprecated: use trainAsync instead]

  }, {
    key: 'workerTrain',
    value: function workerTrain(set, callback, options, suppressWarning) {
      if (!suppressWarning) {
        console.warn('Deprecated: do not use `workerTrain`, use `trainAsync` instead.');
      }
      var that = this;

      if (!this.network.optimized) this.network.optimize();

      // Create a new worker
      var worker = this.network.worker(this.network.optimized.memory, set, options);

      // train the worker
      worker.onmessage = function (e) {
        switch (e.data.action) {
          case 'done':
            var iterations = e.data.message.iterations;
            var error = e.data.message.error;
            var time = e.data.message.time;

            that.network.optimized.ownership(e.data.memoryBuffer);

            // Done callback
            callback({
              error: error,
              iterations: iterations,
              time: time
            });

            // Delete the worker and all its associated memory
            worker.terminate();
            break;

          case 'log':
            console.log(e.data.message);

          case 'schedule':
            if (options && options.schedule && typeof options.schedule.do === 'function') {
              var scheduled = options.schedule.do;
              scheduled(e.data.message);
            }
            break;
        }
      };

      // Start the worker
      worker.postMessage({ action: 'startTraining' });
    }

    // trains an XOR to the network

  }, {
    key: 'XOR',
    value: function XOR(options) {
      if (this.network.inputs() != 2 || this.network.outputs() != 1) throw new Error('Incompatible network (2 inputs, 1 output)');

      var defaults = {
        iterations: 100000,
        log: false,
        shuffle: true,
        cost: Trainer.cost.MSE
      };

      if (options) for (var i in options) {
        defaults[i] = options[i];
      }return this.train([{
        input: [0, 0],
        output: [0]
      }, {
        input: [1, 0],
        output: [1]
      }, {
        input: [0, 1],
        output: [1]
      }, {
        input: [1, 1],
        output: [0]
      }], defaults);
    }

    // trains the network to pass a Distracted Sequence Recall test

  }, {
    key: 'DSR',
    value: function DSR(options) {
      options = options || {};

      var targets = options.targets || [2, 4, 7, 8];
      var distractors = options.distractors || [3, 5, 6, 9];
      var prompts = options.prompts || [0, 1];
      var length = options.length || 24;
      var criterion = options.success || 0.95;
      var iterations = options.iterations || 100000;
      var rate = options.rate || .1;
      var log = options.log || 0;
      var schedule = options.schedule || {};
      var cost = options.cost || this.cost || Trainer.cost.CROSS_ENTROPY;

      var trial, correct, i, j, success;
      trial = correct = i = j = success = 0;
      var error = 1,
          symbols = targets.length + distractors.length + prompts.length;

      var noRepeat = function noRepeat(range, avoid) {
        var number = Math.random() * range | 0;
        var used = false;
        for (var i in avoid) {
          if (number == avoid[i]) used = true;
        }return used ? noRepeat(range, avoid) : number;
      };

      var equal = function equal(prediction, output) {
        for (var i in prediction) {
          if (Math.round(prediction[i]) != output[i]) return false;
        }return true;
      };

      var start = Date.now();

      while (trial < iterations && (success < criterion || trial % 1000 != 0)) {
        // generate sequence
        var sequence = [],
            sequenceLength = length - prompts.length;
        for (i = 0; i < sequenceLength; i++) {
          var any = Math.random() * distractors.length | 0;
          sequence.push(distractors[any]);
        }
        var indexes = [],
            positions = [];
        for (i = 0; i < prompts.length; i++) {
          indexes.push(Math.random() * targets.length | 0);
          positions.push(noRepeat(sequenceLength, positions));
        }
        positions = positions.sort();
        for (i = 0; i < prompts.length; i++) {
          sequence[positions[i]] = targets[indexes[i]];
          sequence.push(prompts[i]);
        }

        //train sequence
        var distractorsCorrect;
        var targetsCorrect = distractorsCorrect = 0;
        error = 0;
        for (i = 0; i < length; i++) {
          // generate input from sequence
          var input = [];
          for (j = 0; j < symbols; j++) {
            input[j] = 0;
          }input[sequence[i]] = 1;

          // generate target output
          var output = [];
          for (j = 0; j < targets.length; j++) {
            output[j] = 0;
          }if (i >= sequenceLength) {
            var index = i - sequenceLength;
            output[indexes[index]] = 1;
          }

          // check result
          var prediction = this.network.activate(input);

          if (equal(prediction, output)) {
            if (i < sequenceLength) distractorsCorrect++;else targetsCorrect++;
          } else {
            this.network.propagate(rate, output);
          }

          error += cost(output, prediction);

          if (distractorsCorrect + targetsCorrect == length) correct++;
        }

        // calculate error
        if (trial % 1000 == 0) correct = 0;
        trial++;
        var divideError = trial % 1000;
        divideError = divideError == 0 ? 1000 : divideError;
        success = correct / divideError;
        error /= length;

        // log
        if (log && trial % log == 0) console.log('iterations:', trial, ' success:', success, ' correct:', correct, ' time:', Date.now() - start, ' error:', error);
        if (schedule.do && schedule.every && trial % schedule.every == 0) schedule.do({
          iterations: trial,
          success: success,
          error: error,
          time: Date.now() - start,
          correct: correct
        });
      }

      return {
        iterations: trial,
        success: success,
        error: error,
        time: Date.now() - start
      };
    }

    // train the network to learn an Embeded Reber Grammar

  }, {
    key: 'ERG',
    value: function ERG(options) {

      options = options || {};
      var iterations = options.iterations || 150000;
      var criterion = options.error || .05;
      var rate = options.rate || .1;
      var log = options.log || 500;
      var cost = options.cost || this.cost || Trainer.cost.CROSS_ENTROPY;

      // gramar node
      var Node = function Node() {
        this.paths = [];
      };
      Node.prototype = {
        connect: function connect(node, value) {
          this.paths.push({
            node: node,
            value: value
          });
          return this;
        },
        any: function any() {
          if (this.paths.length == 0) return false;
          var index = Math.random() * this.paths.length | 0;
          return this.paths[index];
        },
        test: function test(value) {
          for (var i in this.paths) {
            if (this.paths[i].value == value) return this.paths[i];
          }return false;
        }
      };

      var reberGrammar = function reberGrammar() {

        // build a reber grammar
        var output = new Node();
        var n1 = new Node().connect(output, 'E');
        var n2 = new Node().connect(n1, 'S');
        var n3 = new Node().connect(n1, 'V').connect(n2, 'P');
        var n4 = new Node().connect(n2, 'X');
        n4.connect(n4, 'S');
        var n5 = new Node().connect(n3, 'V');
        n5.connect(n5, 'T');
        n2.connect(n5, 'X');
        var n6 = new Node().connect(n4, 'T').connect(n5, 'P');
        var input = new Node().connect(n6, 'B');

        return {
          input: input,
          output: output
        };
      };

      // build an embeded reber grammar
      var embededReberGrammar = function embededReberGrammar() {
        var reber1 = reberGrammar();
        var reber2 = reberGrammar();

        var output = new Node();
        var n1 = new Node().connect(output, 'E');
        reber1.output.connect(n1, 'T');
        reber2.output.connect(n1, 'P');
        var n2 = new Node().connect(reber1.input, 'P').connect(reber2.input, 'T');
        var input = new Node().connect(n2, 'B');

        return {
          input: input,
          output: output
        };
      };

      // generate an ERG sequence
      var generate = function generate() {
        var node = embededReberGrammar().input;
        var next = node.any();
        var str = '';
        while (next) {
          str += next.value;
          next = next.node.any();
        }
        return str;
      };

      // test if a string matches an embeded reber grammar
      var test = function test(str) {
        var node = embededReberGrammar().input;
        var i = 0;
        var ch = str.charAt(i);
        while (i < str.length) {
          var next = node.test(ch);
          if (!next) return false;
          node = next.node;
          ch = str.charAt(++i);
        }
        return true;
      };

      // helper to check if the output and the target vectors match
      var different = function different(array1, array2) {
        var max1 = 0;
        var i1 = -1;
        var max2 = 0;
        var i2 = -1;
        for (var i in array1) {
          if (array1[i] > max1) {
            max1 = array1[i];
            i1 = i;
          }
          if (array2[i] > max2) {
            max2 = array2[i];
            i2 = i;
          }
        }

        return i1 != i2;
      };

      var iteration = 0;
      var error = 1;
      var table = {
        'B': 0,
        'P': 1,
        'T': 2,
        'X': 3,
        'S': 4,
        'E': 5
      };

      var start = Date.now();
      while (iteration < iterations && error > criterion) {
        var i = 0;
        error = 0;

        // ERG sequence to learn
        var sequence = generate();

        // input
        var read = sequence.charAt(i);
        // target
        var predict = sequence.charAt(i + 1);

        // train
        while (i < sequence.length - 1) {
          var input = [];
          var target = [];
          for (var j = 0; j < 6; j++) {
            input[j] = 0;
            target[j] = 0;
          }
          input[table[read]] = 1;
          target[table[predict]] = 1;

          var output = this.network.activate(input);

          if (different(output, target)) this.network.propagate(rate, target);

          read = sequence.charAt(++i);
          predict = sequence.charAt(i + 1);

          error += cost(target, output);
        }
        error /= sequence.length;
        iteration++;
        if (iteration % log == 0) {
          console.log('iterations:', iteration, ' time:', Date.now() - start, ' error:', error);
        }
      }

      return {
        iterations: iteration,
        error: error,
        time: Date.now() - start,
        test: test,
        generate: generate
      };
    }
  }, {
    key: 'timingTask',
    value: function timingTask(options) {

      if (this.network.inputs() != 2 || this.network.outputs() != 1) throw new Error('Invalid Network: must have 2 inputs and one output');

      if (typeof options == 'undefined') options = {};

      // helper
      function getSamples(trainingSize, testSize) {

        // sample size
        var size = trainingSize + testSize;

        // generate samples
        var t = 0;
        var set = [];
        for (var i = 0; i < size; i++) {
          set.push({ input: [0, 0], output: [0] });
        }
        while (t < size - 20) {
          var n = Math.round(Math.random() * 20);
          set[t].input[0] = 1;
          for (var j = t; j <= t + n; j++) {
            set[j].input[1] = n / 20;
            set[j].output[0] = 0.5;
          }
          t += n;
          n = Math.round(Math.random() * 20);
          for (var k = t + 1; k <= t + n && k < size; k++) {
            set[k].input[1] = set[t].input[1];
          }t += n;
        }

        // separate samples between train and test sets
        var trainingSet = [];
        var testSet = [];
        for (var l = 0; l < size; l++) {
          (l < trainingSize ? trainingSet : testSet).push(set[l]);
        } // return samples
        return {
          train: trainingSet,
          test: testSet
        };
      }

      var iterations = options.iterations || 200;
      var error = options.error || .005;
      var rate = options.rate || [.03, .02];
      var log = options.log === false ? false : options.log || 10;
      var cost = options.cost || this.cost || Trainer.cost.MSE;
      var trainingSamples = options.trainSamples || 7000;
      var testSamples = options.trainSamples || 1000;

      // samples for training and testing
      var samples = getSamples(trainingSamples, testSamples);

      // train
      var result = this.train(samples.train, {
        rate: rate,
        log: log,
        iterations: iterations,
        error: error,
        cost: cost
      });

      return {
        train: result,
        test: this.test(samples.test)
      };
    }
  }]);

  return Trainer;
}();

Trainer.cost = cost;
exports.default = Trainer;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Architect = exports.Network = exports.Trainer = exports.Layer = exports.Neuron = undefined;

var _Neuron = __webpack_require__(2);

Object.defineProperty(exports, 'Neuron', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Neuron).default;
  }
});

var _Layer = __webpack_require__(0);

Object.defineProperty(exports, 'Layer', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Layer).default;
  }
});

var _Trainer = __webpack_require__(3);

Object.defineProperty(exports, 'Trainer', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Trainer).default;
  }
});

var _Network = __webpack_require__(1);

Object.defineProperty(exports, 'Network', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Network).default;
  }
});

var _architect = __webpack_require__(7);

var Architect = _interopRequireWildcard(_architect);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.Architect = Architect;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var connections = exports.connections = 0;

var Connection = function () {
  function Connection(from, to, weight) {
    _classCallCheck(this, Connection);

    if (!from || !to) throw new Error("Connection Error: Invalid neurons");

    this.ID = Connection.uid();
    this.from = from;
    this.to = to;
    this.weight = typeof weight == 'undefined' ? Math.random() * .2 - .1 : weight;
    this.gain = 1;
    this.gater = null;
  }

  _createClass(Connection, null, [{
    key: "uid",
    value: function uid() {
      return exports.connections = connections += 1, connections - 1;
    }
  }]);

  return Connection;
}();

exports.default = Connection;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.connections = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Layer = __webpack_require__(0);

var _Layer2 = _interopRequireDefault(_Layer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// represents a connection from one layer to another, and keeps track of its weight and gain
var connections = exports.connections = 0;

var LayerConnection = function () {
  function LayerConnection(fromLayer, toLayer, type, weights) {
    _classCallCheck(this, LayerConnection);

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

  _createClass(LayerConnection, [{
    key: 'getType',
    value: function getType(fromLayer, toLayer, type) {
      if (typeof type === 'undefined') {
        if (fromLayer === toLayer) type = _Layer2.default.connectionType.ONE_TO_ONE;else type = _Layer2.default.connectionType.ALL_TO_ALL;
      }

      this.type = {
        allToAll: type === _Layer2.default.connectionType.ALL_TO_ALL,
        allToElse: type === _Layer2.default.connectionType.ALL_TO_ELSE,
        oneToOne: type === _Layer2.default.connectionType.ONE_TO_ONE
      };
    }
  }, {
    key: 'establish',
    value: function establish(fromLayer, weights) {
      switch (true) {
        case !!this.type.allToAll || !!this.type.allToElse:
          this.allToAll(weights);
          break;

        case !!this.type.oneToOne:
          this.oneToOne(weights);
          break;
      }

      fromLayer.connectedTo.push(this);
    }
  }, {
    key: 'allToAll',
    value: function allToAll(weights) {
      for (this._i in this.from.list) {
        for (this._j in this.to.list) {
          this._from = this.from.list[this._i];
          this._to = this.to.list[this._j];

          if (this.type === _Layer2.default.connectionType.ALL_TO_ELSE && this._from === this._to) continue;

          this._connection = this._from.project(this._to, weights);

          this.connections[this._connection.ID] = this._connection;
          this.size = this.list.push(this._connection);
        }
      }
    }
  }, {
    key: 'oneToOne',
    value: function oneToOne(weights) {
      for (this._i in this.from.list) {
        this._from = this.from.list[this._i];
        this._to = this.to.list[this._i];
        this._connection = this._from.project(this._to, weights);

        this.connections[this._connection.ID] = this._connection;
        this.size = this.list.push(this._connection);
      }
    }
  }], [{
    key: 'uid',
    value: function uid() {
      return exports.connections = connections += 1, connections - 1;
    }
  }]);

  return LayerConnection;
}();

exports.default = LayerConnection;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Perceptron = __webpack_require__(8);

Object.defineProperty(exports, 'Perceptron', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Perceptron).default;
  }
});

var _LSTM = __webpack_require__(9);

Object.defineProperty(exports, 'LSTM', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_LSTM).default;
  }
});

var _Liquid = __webpack_require__(10);

Object.defineProperty(exports, 'Liquid', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Liquid).default;
  }
});

var _Hopfield = __webpack_require__(11);

Object.defineProperty(exports, 'Hopfield', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Hopfield).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Network2 = __webpack_require__(1);

var _Network3 = _interopRequireDefault(_Network2);

var _Layer = __webpack_require__(0);

var _Layer2 = _interopRequireDefault(_Layer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Perceptron = function (_Network) {
  _inherits(Perceptron, _Network);

  function Perceptron() {
    _classCallCheck(this, Perceptron);

    var _this = _possibleConstructorReturn(this, (Perceptron.__proto__ || Object.getPrototypeOf(Perceptron)).call(this));

    _this.args = Array.prototype.slice.call(arguments); // convert arguments to Array
    if (_this.args.length < 3) throw new Error('not enough layers (minimum 3) !!');

    _this._inputs = _this.args.shift(); // first argument
    _this._outputs = _this.args.pop(); // last argument
    _this._layers = _this.args; // all the arguments in the middle

    _this._input = new _Layer2.default(_this._inputs);
    _this._hidden = [];
    _this._output = new _Layer2.default(_this._outputs);

    _this._previous = _this._input;

    _this.generateHiddenLayers();

    _this._previous.project(_this._output);

    // set layers of the neural network
    _this.set({
      input: _this._input,
      hidden: _this._hidden,
      output: _this._output
    });
    return _this;
  }

  // generate hidden layers


  _createClass(Perceptron, [{
    key: 'generateHiddenLayers',
    value: function generateHiddenLayers() {
      for (this._i in this._layers) {
        this._size = this._layers[this._i];
        this._layer = new _Layer2.default(this._size);
        this._hidden.push(this._layer);
        this._previous.project(this._layer);
        this._previous = this._layer;
      }
    }
  }]);

  return Perceptron;
}(_Network3.default);

exports.default = Perceptron;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Network2 = __webpack_require__(1);

var _Network3 = _interopRequireDefault(_Network2);

var _Layer = __webpack_require__(0);

var _Layer2 = _interopRequireDefault(_Layer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LSTM = function (_Network) {
  _inherits(LSTM, _Network);

  function LSTM() {
    _classCallCheck(this, LSTM);

    var _this = _possibleConstructorReturn(this, (LSTM.__proto__ || Object.getPrototypeOf(LSTM)).call(this));

    var args = Array.prototype.slice.call(arguments); // convert arguments to array
    if (args.length < 3) throw new Error("not enough layers (minimum 3) !!");

    var last = args.pop();
    var option = {
      peepholes: _Layer2.default.connectionType.ALL_TO_ALL,
      hiddenToHidden: false,
      outputToHidden: false,
      outputToGates: false,
      inputToOutput: true
    };
    if (typeof last != 'number') {
      var outputs = args.pop();
      if (last.hasOwnProperty('peepholes')) option.peepholes = last.peepholes;
      if (last.hasOwnProperty('hiddenToHidden')) option.hiddenToHidden = last.hiddenToHidden;
      if (last.hasOwnProperty('outputToHidden')) option.outputToHidden = last.outputToHidden;
      if (last.hasOwnProperty('outputToGates')) option.outputToGates = last.outputToGates;
      if (last.hasOwnProperty('inputToOutput')) option.inputToOutput = last.inputToOutput;
    } else {
      var outputs = last;
    }

    var inputs = args.shift();
    var layers = args;

    var inputLayer = new _Layer2.default(inputs);
    var hiddenLayers = [];
    var outputLayer = new _Layer2.default(outputs);

    var previous = null;

    // generate layers
    for (var i = 0; i < layers.length; i++) {
      // generate memory blocks (memory cell and respective gates)
      var size = layers[i];

      var inputGate = new _Layer2.default(size).set({
        bias: 1
      });
      var forgetGate = new _Layer2.default(size).set({
        bias: 1
      });
      var memoryCell = new _Layer2.default(size);
      var outputGate = new _Layer2.default(size).set({
        bias: 1
      });

      hiddenLayers.push(inputGate);
      hiddenLayers.push(forgetGate);
      hiddenLayers.push(memoryCell);
      hiddenLayers.push(outputGate);

      // connections from input layer
      var input = inputLayer.project(memoryCell);
      inputLayer.project(inputGate);
      inputLayer.project(forgetGate);
      inputLayer.project(outputGate);

      // connections from previous memory-block layer to this one
      if (previous != null) {
        var cell = previous.project(memoryCell);
        previous.project(inputGate);
        previous.project(forgetGate);
        previous.project(outputGate);
      }

      // connections from memory cell
      var output = memoryCell.project(outputLayer);

      // self-connection
      var self = memoryCell.project(memoryCell);

      // hidden to hidden recurrent connection
      if (option.hiddenToHidden) memoryCell.project(memoryCell, _Layer2.default.connectionType.ALL_TO_ELSE);

      // out to hidden recurrent connection
      if (option.outputToHidden) outputLayer.project(memoryCell);

      // out to gates recurrent connection
      if (option.outputToGates) {
        outputLayer.project(inputGate);
        outputLayer.project(outputGate);
        outputLayer.project(forgetGate);
      }

      // peepholes
      memoryCell.project(inputGate, option.peepholes);
      memoryCell.project(forgetGate, option.peepholes);
      memoryCell.project(outputGate, option.peepholes);

      // gates
      inputGate.gate(input, _Layer2.default.gateType.INPUT);
      forgetGate.gate(self, _Layer2.default.gateType.ONE_TO_ONE);
      outputGate.gate(output, _Layer2.default.gateType.OUTPUT);
      if (previous != null) inputGate.gate(cell, _Layer2.default.gateType.INPUT);

      previous = memoryCell;
    }

    // input to output direct connection
    if (option.inputToOutput) inputLayer.project(outputLayer);

    // set the layers of the neural network
    _this.set({
      input: inputLayer,
      hidden: hiddenLayers,
      output: outputLayer
    });
    return _this;
  }

  return LSTM;
}(_Network3.default);

exports.default = LSTM;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Network2 = __webpack_require__(1);

var _Network3 = _interopRequireDefault(_Network2);

var _Layer = __webpack_require__(0);

var _Layer2 = _interopRequireDefault(_Layer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Liquid = function (_Network) {
  _inherits(Liquid, _Network);

  function Liquid(inputs, hidden, outputs, connections, gates) {
    _classCallCheck(this, Liquid);

    // create layers
    var _this = _possibleConstructorReturn(this, (Liquid.__proto__ || Object.getPrototypeOf(Liquid)).call(this));

    var inputLayer = new _Layer2.default(inputs);
    var hiddenLayer = new _Layer2.default(hidden);
    var outputLayer = new _Layer2.default(outputs);

    // make connections and gates randomly among the neurons
    var neurons = hiddenLayer.neurons();
    var connectionList = [];

    for (var i = 0; i < connections; i++) {
      // connect two random neurons
      var from = Math.random() * neurons.length | 0;
      var to = Math.random() * neurons.length | 0;
      var connection = neurons[from].project(neurons[to]);
      connectionList.push(connection);
    }

    for (var j = 0; j < gates; j++) {
      // pick a random gater neuron
      var gater = Math.random() * neurons.length | 0;
      // pick a random connection to gate
      var connection = Math.random() * connectionList.length | 0;
      // let the gater gate the connection
      neurons[gater].gate(connectionList[connection]);
    }

    // connect the layers
    inputLayer.project(hiddenLayer);
    hiddenLayer.project(outputLayer);

    // set the layers of the network
    _this.set({
      input: inputLayer,
      hidden: [hiddenLayer],
      output: outputLayer
    });
    return _this;
  }

  return Liquid;
}(_Network3.default);

exports.default = Liquid;

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Network2 = __webpack_require__(1);

var _Network3 = _interopRequireDefault(_Network2);

var _Trainer = __webpack_require__(3);

var _Trainer2 = _interopRequireDefault(_Trainer);

var _Layer = __webpack_require__(0);

var _Layer2 = _interopRequireDefault(_Layer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Hopfield = function (_Network) {
  _inherits(Hopfield, _Network);

  function Hopfield(size) {
    _classCallCheck(this, Hopfield);

    var _this = _possibleConstructorReturn(this, (Hopfield.__proto__ || Object.getPrototypeOf(Hopfield)).call(this));

    var inputLayer = new _Layer2.default(size);
    var outputLayer = new _Layer2.default(size);

    inputLayer.project(outputLayer, _Layer2.default.connectionType.ALL_TO_ALL);

    _this.set({
      input: inputLayer,
      hidden: [],
      output: outputLayer
    });

    _this.trainer = new _Trainer2.default(_this);
    return _this;
  }

  _createClass(Hopfield, [{
    key: 'learn',
    value: function learn(patterns) {
      var set = [];
      for (var p in patterns) {
        set.push({
          input: patterns[p],
          output: patterns[p]
        });
      }return this.trainer.train(set, {
        iterations: 500000,
        error: .00005,
        rate: 1
      });
    }
  }, {
    key: 'feed',
    value: function feed(pattern) {
      var output = this.activate(pattern);

      var pattern = [];
      for (var i in output) {
        pattern[i] = output[i] > .5 ? 1 : 0;
      }return pattern;
    }
  }]);

  return Hopfield;
}(_Network3.default);

exports.default = Hopfield;

/***/ })
/******/ ]);
});