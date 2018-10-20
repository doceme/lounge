(window.webpackJsonp=window.webpackJsonp||[]).push([[22],{160:function(e,t,s){"use strict";s.r(t);var n=s(0),a=Object(n.a)({},function(){this.$createElement;this._self._c;return this._m(0)},[function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"content"},[s("h1",{attrs:{id:"saving-documents"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#saving-documents","aria-hidden":"true"}},[e._v("#")]),e._v(" Saving Documents")]),e._v(" "),s("p",[e._v("Saving documents is done using "),s("code",[e._v("save")]),e._v(" function that every model instance has. This will execute all pre\n'save' middleware and then perform Couchbase "),s("code",[e._v("upsert")]),e._v(" operation on any subdocuments and the actual document. It will also\nperform lookup document updates and finally execute any post hook middleware.")]),e._v(" "),s("p",[e._v("From our example code above:")]),e._v(" "),s("div",{staticClass:"language-js extra-class"},[s("pre",{pre:!0,attrs:{class:"language-js"}},[s("code",[e._v("user"),s("span",{attrs:{class:"token punctuation"}},[e._v(".")]),s("span",{attrs:{class:"token function"}},[e._v("save")]),s("span",{attrs:{class:"token punctuation"}},[e._v("(")]),s("span",{attrs:{class:"token keyword"}},[e._v("function")]),s("span",{attrs:{class:"token punctuation"}},[e._v("(")]),e._v("err"),s("span",{attrs:{class:"token punctuation"}},[e._v(",")]),e._v(" savedDoc"),s("span",{attrs:{class:"token punctuation"}},[e._v(")")]),e._v(" "),s("span",{attrs:{class:"token punctuation"}},[e._v("{")]),e._v("\n  "),s("span",{attrs:{class:"token keyword"}},[e._v("if")]),s("span",{attrs:{class:"token punctuation"}},[e._v("(")]),e._v("err"),s("span",{attrs:{class:"token punctuation"}},[e._v(")")]),e._v(" console"),s("span",{attrs:{class:"token punctuation"}},[e._v(".")]),s("span",{attrs:{class:"token function"}},[e._v("log")]),s("span",{attrs:{class:"token punctuation"}},[e._v("(")]),e._v("err"),s("span",{attrs:{class:"token punctuation"}},[e._v(")")]),e._v("\n"),s("span",{attrs:{class:"token punctuation"}},[e._v("}")]),s("span",{attrs:{class:"token punctuation"}},[e._v(")")]),e._v("\n")])])]),s("p",[e._v("All documents and subdocuments would be upserted into the database.")]),e._v(" "),s("p",[s("strong",[e._v("Model.save(data, options, fn)")])]),e._v(" "),s("p",[s("code",[e._v("data")]),e._v(" - any data to be set into the model before saving.")]),e._v(" "),s("p",[s("strong",[e._v("options")])]),e._v(" "),s("p",[e._v("All options not present here are first looked up from schema options, and then from config options.")]),e._v(" "),s("ul",[s("li",[s("code",[e._v("storeFullReferenceId")]),e._v(" - whether to save embedded document property values as full document keys or just the base value")]),e._v(" "),s("li",[s("code",[e._v("storeFullKey")]),e._v(" - whether to save the internal document key property as fully expanded value or as the simple value")]),e._v(" "),s("li",[s("code",[e._v("refIndexKeyPrefix")]),e._v(" - lookup index document key prefix.")]),e._v(" "),s("li",[s("code",[e._v("waitForIndex")]),e._v(" - whether we want to wait for indexing to finish before returning. default is false.")]),e._v(" "),s("li",[s("code",[e._v("virtuals")]),e._v(" - whether we want to save virtuals. default is "),s("code",[e._v("false")]),e._v(".")]),e._v(" "),s("li",[s("code",[e._v("minimize")]),e._v(' - to "minimize" the document by removing any empty properties. Default: '),s("code",[e._v("true")])]),e._v(" "),s("li",[s("code",[e._v("expiry")]),e._v(" - couchbase upsert option")]),e._v(" "),s("li",[s("code",[e._v("persist_to")]),e._v(" - couchbase persist_to option")]),e._v(" "),s("li",[s("code",[e._v("replicate_to")]),e._v(" - couchbase option")])])])}],!1,null,null,null);a.options.__file="saving.md";t.default=a.exports}}]);