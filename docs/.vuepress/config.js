module.exports = {
  title: 'Lounge',
  description: 'Simple Mongoose-inspired ODM for Couchbase',
  base: '/lounge',
  themeConfig: {
    nav: [
      {
        text: 'Guide',
        link: '/guide/'
      },
      {
        text: 'API Reference',
        link: '/api/'
      },
      { text: 'GitHub', link: 'https://github.com/bojand/lounge' }
    ],
    sidebar: {
      '/guide/': [
        {
          title: 'Guide',
          collapsable: false,
          children: [
            '',
            'modeling',
            'types',
            'middleware',
            'extend',
            'embedded',
            'docops',
            'population',
            'simple_indexes',
            'queries',
            'array_indexes',
            'embedded_indexes',
            'compound',
            'lean_queries',
            'events',
            'promises',
            'debugging'
          ]
        }
      ],
      // '/api/': {
      //   title: 'API Reference',
      //   collapsable: false,
      //   children: [
      //     ['AbstractBaseModel', 'AbstractBaseModel'],
      //     ['BaseModel', 'BaseModel'],
      //     ['CouchbaseDocument', 'CouchbaseDocument'],
      //     ['Document', 'Document'],
      //     ['Lounge', 'Lounge'],
      //     ['Model', 'Model'],
      //     ['ModelInstance', 'ModelInstance'],
      //     ['Schema', 'Schema']
      //   ]
      // }
      '/api/': [
        ['', 'Classes'],
        ['AbstractBaseModel', 'AbstractBaseModel'],
        ['BaseModel', 'BaseModel'],
        ['CouchbaseDocument', 'CouchbaseDocument'],
        ['Document', 'Document'],
        ['Lounge', 'Lounge'],
        ['Model', 'Model'],
        ['ModelInstance', 'ModelInstance'],
        ['Schema', 'Schema']
      ]
      // '/api/': [
      //   {
      //     title: 'API Reference',
      //     collapsable: false,
      //     children: [
      //       ['#classes', 'Classes'],
      //       ['#abstractbasemodel', 'AbstractBaseModel'],
      //       ['#basemodel-⇐-eventemitter', 'BaseModel'],
      //       ['#couchbasedocument', 'CouchbaseDocument'],
      //       ['#document', 'Document'],
      //       ['#lounge', 'Lounge'],
      //       ['#model', 'Model'],
      //       ['#modelinstance', 'ModelInstance'],
      //       ['#schema', 'Schema']
      //     ]
      //   }
      // ]
    }
  }
  // markdown: {
  //   config: md => {
  //     md.use(require('markdown-it-highlightjs'))
  //   }
  // }
}
