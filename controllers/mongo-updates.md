# Mongo Updates

## 7-2020

```yaml
(node:16431) DeprecationWarning: collection.count is deprecated, and will be removed in a future version. Use Collection.countDocuments or Collection.estimatedDocumentCount instead
```

- in `storeController.js` change:

`const countPromise = Store.count();`

- to:

`const countPromise = Store.countDocuments();`
