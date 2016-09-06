//公共帮手 用于实现 $$ 和 ||
Template.registerHelper('and',function(a,b){
  return a && b;
});
Template.registerHelper('or',function(a,b){
  return a || b;
});
