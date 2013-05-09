var evalScheem = function (expr, env) {
   // Numbers evaluate to themselves
   var j,k;
   if (typeof expr === 'number') {
      return expr;
   }
   if (typeof expr === 'string') {
      return env[expr];
   }

   var isNumeric = function(n) {
      return !isNaN(parseFloat(n)) && isFinite(n);
   };
   
   var numericParameters = function() {
      if (expr[1] === undefined || expr[2] === undefined) {return false;}
      if (isNumeric(evalScheem(expr[1], env)) && 
      isNumeric(evalScheem(expr[2], env))) {
         return true;
      }
       return false;
   };

    // Look at head of list for operation
   switch (expr[0]) {
      case '+':
      if (numericParameters()) { 
         return evalScheem(expr[1], env) +
         evalScheem(expr[2], env);
      }
      throw new Error('Invalid type');
      case '-':
         return evalScheem(expr[1], env) - 
         evalScheem(expr[2], env);
      case '*':
         return evalScheem(expr[1], env) *
         evalScheem(expr[2], env);
      case '/':
         return evalScheem(expr[1], env) /
         evalScheem(expr[2], env);
      case '<':
         return evalScheem(expr[1], env) <
         evalScheem(expr[2], env) ? '#t': '#f';
      case '>':
         return evalScheem(expr[1], env) >
         evalScheem(expr[2], env) ? '#t': '#f';
      case '=':
         return (evalScheem(expr[1], env) ===
         evalScheem(expr[2], env) ? '#t': '#f');
      case 'if':
         if (evalScheem(expr[1], env) === '#t') {
            return evalScheem(expr[2], env);
         }
         return evalScheem(expr[3], env);
      case 'cons':
         k = evalScheem(expr[2], env);
         k.splice(0,0,evalScheem(expr[1], env));
         return k;
      case 'car':
         return evalScheem(expr[1], env)[0];
      case 'cdr':
         return evalScheem(expr[1], env).slice(1);
      case 'quote':
         return expr[1];
      case 'begin':
         for (j = 1, k = expr.length - 1; j < k; j++) {
            evalScheem(expr[j], env);
         }
         return evalScheem(expr[j], env);
      case 'set!':
         env[expr[1]] = evalScheem(expr[2], env);
         return 0;
    }
};

var evalScheemString = function(expr, env) {
   return evalScheem(SCHEEM.parse(expr), env);
}
