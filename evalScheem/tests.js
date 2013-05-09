if (typeof window === 'undefined') {
   //nodejs - load modules
   var assert = require('chai').assert;
   var evalScheem = require('./evalScheem.js');
   var parse = require('./parser.js').parse;
} else {
   //in browser
   var parse = SCHEEM.parse;
   var assert = chai.assert;
}

var evalScheemString = function(expr, env) {
   return evalScheem(parse(expr), env);
};

suite('quote', function() {
    test('a number', function() {
        assert.deepEqual(
            evalScheem(['quote', 3], {}),
            3
        );
    });
    test('an atom', function() {
        assert.deepEqual(
            evalScheem(['quote', 'dog'], {}),
            'dog'
        );
    });
    test('a list', function() {
        assert.deepEqual(
            evalScheem(['quote', [1, 2, 3]], {}),
            [1, 2, 3]
        );
    });
});
suite('arithmetic', function() {
   test('add two numbers', function() {
        assert.deepEqual(
            evalScheem(['+', 3, 5], {}),
            8
        );
   });
   test('add a number and an expression', function() {
        assert.deepEqual(
            evalScheem(['+', 3, ['+', 2, 2]], {}),
            7
        );
   });
   test('a dog and a cat', function() {
      assert.throws(function() {
            evalScheem(['+', 'dog', 'cat'], {});
         });
   });
   test('multiply a number and an expression', function() {
      assert.deepEqual(
         evalScheem(['*', 8, ['/', 10, 5]], {}),
         16
      );
   });
 });
suite('pure number', function() {
   test('5', function() {
      assert.deepEqual(
         evalScheem(5, {}),
         5
      );
   });
   test('273', function() {
      assert.deepEqual(
         evalScheem(273, {}),
         273
      );
   });
});
suite('variables', function() {
   test('x = 3', function() {
      assert.deepEqual(
         evalScheem('x', {x: 3}),
         3
      );
   });
});
suite('comparison', function() {
   test('greater than', function() {
      assert.deepEqual(
         evalScheem(['>', 5, 2], {}),
         '#t'
      );
      assert.deepEqual(
         evalScheem(['>', 2, 5], {}),
         '#f'
      );
   });
   test('less than', function() {
      assert.deepEqual(
         evalScheem(['<', 5, 2], {}),
         '#f'
      );
      assert.deepEqual(
         evalScheem(['<', 2, 5], {}),
         '#t'
      );
   });
   test('equals', function() {
      assert.deepEqual(
         evalScheem(['=', 5, 5], {}),
         '#t'
      );
      assert.deepEqual(
         evalScheem(['=', 2, 5], {}),
         '#f'
      );
   });
});
suite('conditional', function() {
   test('if with gt/lt', function() {
      assert.deepEqual(
         evalScheem(['if', ['<', 1, 5], 6, 9], {}),
         6
      );
      assert.deepEqual(
         evalScheem(['if', ['>', 1, 5], 6, 9], {}),
         9
      );
   });
});
suite('cons, car, cdr', function() {
   test('cons', function() {
      assert.deepEqual(
         evalScheem(['cons', ['quote', [5, 2, 1]], ['quote', [2, 2]]], {}),
         [[5, 2, 1], 2, 2]
      );
      assert.deepEqual(
         evalScheem(['cons', 1, ['quote', [2]]], {}),
         [1, 2]
      );
   });
   test('cdr', function() {
      assert.deepEqual(
         evalScheem(['cdr', ['quote', [5, 2, 1]]], {}),
         [2, 1]
      );
   });
   test('car', function() {
      assert.deepEqual(
         evalScheem(['car', ['quote', [5, 2, 1]]], {}),
         5
      );
   });
});
suite('parse', function() {
   test('a number', function() {
      assert.deepEqual(
         parse('42'),
         42
      );
   });
   test('a variable', function() {
      assert.deepEqual(
         parse('x'),
         'x'
      );
   });
});
suite('parse and eval', function() {
   test('a number', function() {
      assert.deepEqual(
         evalScheemString('42'),
         42
      );
   });
   test('an expression', function() {
      assert.deepEqual(
         evalScheemString('(+ 5 3)'),
         8
      );
   });
   test('a sub-expression', function() {
      assert.deepEqual(
         evalScheemString('(+ 5 (* 2 3))'),
         11
      );
   });
   test('an invalid expression', function() {
      assert.throws(function() {
         evalScheemString('(+ 5 (* 2 3)');
      });
   });
});
