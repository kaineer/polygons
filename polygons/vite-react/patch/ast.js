/*!
 * Copyright (C) 2017 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-parser/graphs/contributors
 * @url http://gla*yzzle.com
 */

var Location = require('./ast/location');
var Position = require('./ast/position');

/**
 * ## Class hierarchy
 *
 * - [Location](#location)
 * - [Position](#position)
 * - [Node](#node)
 *   - [Identifier](#identifier)
 *   - [TraitUse](#traituse)
 *   - [TraitAlias](#traitalias)
 *   - [TraitPrecedence](#traitprecedence)
 *   - [Entry](#entry)
 *   - [Case](#case)
 *   - [Label](#label)
 *   - [Doc](#doc)
 *   - [Error](#error)
 *   - [Expression](#expression)
 *     - [Array](#array)
 *     - [Variable](#variable)
 *     - [Variadic](#variadic)
 *     - [ConstRef](#constref)
 *     - [Yield](#yield)
 *     - [YieldFrom](#yieldfrom)
 *     - [Lookup](#lookup)
 *       - [PropertyLookup](#propertylookup)
 *       - [StaticLookup](#staticlookup)
 *       - [OffsetLookup](#offsetlookup)
 *     - [Operation](#operation)
 *       - [Pre](#pre)
 *       - [Post](#post)
 *       - [Bin](#bin)
 *       - [Parenthesis](#parenthesis)
 *       - [Unary](#unary)
 *       - [Cast](#cast)
 *     - [Literal](#literal)
 *       - [Boolean](#boolean)
 *       - [String](#string)
 *       - [Number](#number)
 *       - [Inline](#inline)
 *       - [Magic](#magic)
 *       - [Nowdoc](#nowdoc)
 *       - [Encapsed](#encapsed)
 *   - [Statement](#statement)
 *     - [Eval](#eval)
 *     - [Exit](#exit)
 *     - [Halt](#halt)
 *     - [Clone](#clone)
 *     - [Declare](#declare)
 *     - [Global](#global)
 *     - [Static](#static)
 *     - [Include](#include)
 *     - [Assign](#assign)
 *     - [RetIf](#retif)
 *     - [If](#if)
 *     - [Do](#do)
 *     - [While](#while)
 *     - [For](#for)
 *     - [Foreach](#foreach)
 *     - [Switch](#switch)
 *     - [Goto](#goto)
 *     - [Silent](#silent)
 *     - [Try](#try)
 *     - [Catch](#catch)
 *     - [Throw](#throw)
 *     - [Call](#call)
 *     - [Closure](#closure)
 *     - [New](#new)
 *     - [UseGroup](#usegroup)
 *     - [UseItem](#useitem)
 *     - [Block](#block)
 *       - [Program](#program)
 *       - [Namespace](#namespace)
 *     - [Sys](#sys)
 *       - [Echo](#echo)
 *       - [List](#list)
 *       - [Print](#print)
 *       - [Isset](#isset)
 *       - [Unset](#unset)
 *       - [Empty](#empty)
 *     - [Declaration](#declaration)
 *       - [Class](#class)
 *       - [Interface](#interface)
 *       - [Trait](#trait)
 *       - [Constant](#constant)
 *         - [ClassConstant](#classconstant)
 *       - [Function](#function)
 *         - [Method](#method)
 *       - [Parameter](#parameter)
 *       - [Property](#property)
 * ---
 */

/**
 * The AST builder class
 * @constructor AST
 * @property {Boolean} withPositions - Should locate any node (by default false)
 * @property {Boolean} withSource - Should extract the node original code (by default false)
 */
var AST = function(withPositions, withSource) {
  this.withPositions = withPositions;
  this.withSource = withSource;
};

/**
 * Create a position node from specified parser
 * including it's lexer current state
 * @param {Parser}
 * @return {Position}
 * @private
 */
AST.prototype.position = function(parser) {
  return new Position(
    parser.lexer.yylloc.first_line,
    parser.lexer.yylloc.first_column,
    parser.lexer.yylloc.first_offset
  );
};


// operators in ascending order of precedence
AST.precedence = {};
var binOperatorsPrecedence = [
  ['or'],
  ['xor'],
  ['and'],
  ['='],
  ['?'],
  ['??'],
  ['||'],
  ['&&'],
  ['|'],
  ['^'],
  ['&'],
  ['==', '!=', '===', '!==', /* '<>', */ '<=>'],
  ['<', '<=', '>', '>='],
  ['<<', '>>'],
  ['+', '-', '.'],
  ['*', '/', '%'],
  ['!'],
  ['instanceof'],
  // TODO: typecasts
  // TODO: [ (array)
  // TODO: clone, new
].forEach(function (list, index) {
  list.forEach(function (operator) {
    AST.precedence[operator] = index + 1;
  });
});


/**
 * Check and fix precence, by default using right
 */
AST.prototype.resolvePrecedence = function(result) {
  var buffer;
  // handling precendence
  if (result.kind === 'bin') {
    if (result.right) {
      if (result.right.kind === 'bin') {
        var lLevel = AST.precedence[result.type];
        var rLevel = AST.precedence[result.right.type];
        if (lLevel && rLevel && rLevel <= lLevel) {
          // https://github.com/glayzzle/php-parser/issues/79
          // shift precedence
          buffer = result.right;
          result.right = result.right.left;
          buffer.left = this.resolvePrecedence(result);
          result = buffer;
        }
      } else if (result.right.kind === 'retif') {
        var lLevel = AST.precedence[result.type];
        var rLevel = AST.precedence['?'];
        if (lLevel && rLevel && rLevel <= lLevel) {
          buffer = result.right;
          result.right = result.right.test;
          buffer.test = this.resolvePrecedence(result);
          result = buffer;
        }
      }
    }
  } else if (result.kind === 'unary') {
    // https://github.com/glayzzle/php-parser/issues/75
    if (result.what) {
      // unary precedence is allways lower
      if (result.what.kind === 'bin') {
        buffer = result.what;
        result.what = result.what.left;
        buffer.left = this.resolvePrecedence(result);
        result = buffer;
      } else if (result.what.kind === 'retif') {
        buffer = result.what;
        result.what = result.what.test;
        buffer.test = this.resolvePrecedence(result);
        result = buffer;
      }
    }
  } else if (result.kind === 'retif') {
    // https://github.com/glayzzle/php-parser/issues/77
    if (result.falseExpr && result.falseExpr.kind === 'retif') {
      buffer = result.falseExpr;
      result.falseExpr = buffer.test;
      buffer.test = this.resolvePrecedence(result);
      result = buffer;
    }
  } else if (result.kind === 'assign') {
    // https://github.com/glayzzle/php-parser/issues/81
    if (result.right && result.right.kind === 'bin') {
      var lLevel = AST.precedence['='];
      var rLevel = AST.precedence[result.right.type];
      // only shifts with and, xor, or
      if (lLevel && rLevel && rLevel < lLevel) {
        buffer = result.right;
        result.right = result.right.left;
        buffer.left = result;
        result = buffer;
      }
    }
  }
  return result;
};

/**
 * Prepares an AST node
 * @param {String|null} kind - Defines the node type
 * (if null, the kind must be passed at the function call)
 * @param {Parser} parser - The parser instance (use for extracting locations)
 * @return {Function}
 */
AST.prototype.prepare = function(kind, parser) {
  var start = null;
  if (this.withPositions || this.withSource) {
    start = this.position(parser);
  }
  var self = this;
  // returns the node
  return function() {
    var location = null;
    var args = Array.prototype.slice.call(arguments);
    if (self.withPositions || self.withSource) {
      var src = null;
      if (self.withSource) {
        src = parser.lexer._input.substring(
          start.offset,
          parser.lexer.yylloc.prev_offset
        );
      }
      if (self.withPositions) {
        location = new Location(src, start, new Position(
          parser.lexer.yylloc.prev_line,
          parser.lexer.yylloc.prev_column,
          parser.lexer.yylloc.prev_offset
        ));
      } else {
        location = new Location(src, null, null);
      }
      // last argument is allways the location
      args.push(location);
    }
    // handle lazy kind definitions
    if (!kind) {
      kind = args.shift();
    }
    // build the object
    var node = self[kind];
    if (typeof node !== 'function') {
      throw new Error('Undefined node "'+kind+'"');
    }
    var result = Object.create(node.prototype);
    node.apply(result, args);
    return self.resolvePrecedence(result);
  };
};

// NOTE: patched version
//   works finely with vite
AST.prototype["array"] = require("./ast/array");
AST.prototype["assign"] = require("./ast/assign");
AST.prototype["bin"] = require("./ast/bin");
AST.prototype["block"] = require("./ast/block");
AST.prototype["boolean"] = require("./ast/boolean");
AST.prototype["break"] = require("./ast/break");
AST.prototype["call"] = require("./ast/call");
AST.prototype["case"] = require("./ast/case");
AST.prototype["cast"] = require("./ast/cast");
AST.prototype["catch"] = require("./ast/catch");
AST.prototype["class"] = require("./ast/class");
AST.prototype["classconstant"] = require("./ast/classconstant");
AST.prototype["clone"] = require("./ast/clone");
AST.prototype["closure"] = require("./ast/closure");
AST.prototype["constant"] = require("./ast/constant");
AST.prototype["constref"] = require("./ast/constref");
AST.prototype["continue"] = require("./ast/continue");
AST.prototype["declaration"] = require("./ast/declaration");
AST.prototype["declare"] = require("./ast/declare");
AST.prototype["do"] = require("./ast/do");
AST.prototype["doc"] = require("./ast/doc");
AST.prototype["echo"] = require("./ast/echo");
AST.prototype["empty"] = require("./ast/empty");
AST.prototype["encapsed"] = require("./ast/encapsed");
AST.prototype["entry"] = require("./ast/entry");
AST.prototype["error"] = require("./ast/error");
AST.prototype["eval"] = require("./ast/eval");
AST.prototype["exit"] = require("./ast/exit");
AST.prototype["expression"] = require("./ast/expression");
AST.prototype["for"] = require("./ast/for");
AST.prototype["foreach"] = require("./ast/foreach");
AST.prototype["function"] = require("./ast/function");
AST.prototype["global"] = require("./ast/global");
AST.prototype["goto"] = require("./ast/goto");
AST.prototype["halt"] = require("./ast/halt");
AST.prototype["identifier"] = require("./ast/identifier");
AST.prototype["if"] = require("./ast/if");
AST.prototype["include"] = require("./ast/include");
AST.prototype["inline"] = require("./ast/inline");
AST.prototype["interface"] = require("./ast/interface");
AST.prototype["isset"] = require("./ast/isset");
AST.prototype["label"] = require("./ast/label");
AST.prototype["list"] = require("./ast/list");
AST.prototype["literal"] = require("./ast/literal");
AST.prototype["lookup"] = require("./ast/lookup");
AST.prototype["magic"] = require("./ast/magic");
AST.prototype["method"] = require("./ast/method");
AST.prototype["namespace"] = require("./ast/namespace");
AST.prototype["new"] = require("./ast/new");
AST.prototype["node"] = require("./ast/node");
AST.prototype["nowdoc"] = require("./ast/nowdoc");
AST.prototype["number"] = require("./ast/number");
AST.prototype["offsetlookup"] = require("./ast/offsetlookup");
AST.prototype["operation"] = require("./ast/operation");
AST.prototype["parameter"] = require("./ast/parameter");
AST.prototype["parenthesis"] = require("./ast/parenthesis");
AST.prototype["post"] = require("./ast/post");
AST.prototype["pre"] = require("./ast/pre");
AST.prototype["print"] = require("./ast/print");
AST.prototype["program"] = require("./ast/program");
AST.prototype["property"] = require("./ast/property");
AST.prototype["propertylookup"] = require("./ast/propertylookup");
AST.prototype["retif"] = require("./ast/retif");
AST.prototype["return"] = require("./ast/return");
AST.prototype["silent"] = require("./ast/silent");
AST.prototype["statement"] = require("./ast/statement");
AST.prototype["static"] = require("./ast/static");
AST.prototype["staticlookup"] = require("./ast/staticlookup");
AST.prototype["string"] = require("./ast/string");
AST.prototype["switch"] = require("./ast/switch");
AST.prototype["sys"] = require("./ast/sys");
AST.prototype["throw"] = require("./ast/throw");
AST.prototype["trait"] = require("./ast/trait");
AST.prototype["traitalias"] = require("./ast/traitalias");
AST.prototype["traitprecedence"] = require("./ast/traitprecedence");
AST.prototype["traituse"] = require("./ast/traituse");
AST.prototype["try"] = require("./ast/try");
AST.prototype["unary"] = require("./ast/unary");
AST.prototype["unset"] = require("./ast/unset");
AST.prototype["usegroup"] = require("./ast/usegroup");
AST.prototype["useitem"] = require("./ast/useitem");
AST.prototype["variable"] = require("./ast/variable");
AST.prototype["variadic"] = require("./ast/variadic");
AST.prototype["while"] = require("./ast/while");
AST.prototype["yield"] = require("./ast/yield");
AST.prototype["yieldfrom"] = require("./ast/yieldfrom");

module.exports = AST;
