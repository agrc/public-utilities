//>>built
define(["dojo/_base/declare","dojo/_base/lang","dojo/has","esri/kernel","esri/graphic","esri/geometry/jsonUtils"],function(b,c,f,g,d,e){return b(null,{declaredClass:"esri.tasks.FindResult",constructor:function(a){c.mixin(this,a);this.feature=new d(a.geometry?e.fromJson(a.geometry):null,null,a.attributes);delete this.geometry;delete this.attributes}})});