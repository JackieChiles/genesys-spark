# Spark Monorepo

This project contains several packages that make up Genesys' design system, Spark. The packages are:

## genesys-spark

A wrapper package that serves as the default entry-point for using the design system. It provides access to [custom elements](https://developer.mozilla.org/en-US/docs/Web/API/Web_components) loaded from a shared CDN and utilities for common UI related tasks (e.g. localization & formatting). For most use cases, this will be the only package you need.

[Read more...](packages/genesys-spark/README.md)

## genesys-spark-components

A collection of [custom elements](https://developer.mozilla.org/en-US/docs/Web/API/Web_components) and associated styles that provides a nice library of UI widgets.

[Read more...](packages/genesys-spark-components/README.md)

## genesys-spark-visualizations

A collection of [custom elements](https://developer.mozilla.org/en-US/docs/Web/API/Web_components) focused on charts and data visualization.

[Read more...](packages/genesys-spark-visualizations/README.md)

## genesys-spark-components-react

Specialized React bindings for genesys-spark-components. React doesn't always play nice with vanilla custom elements, but these bindings can help.

[Read more...](packages/genesys-spark-components-react/README.md)

## genesys-spark-tokens

The set of [design tokens](https://www.uxpin.com/studio/blog/what-are-design-tokens/) that the Spark components and styles are built on. This is an internal package
that is only used to organize development and is not published.

[Read more...](packages/genesys-spark-tokens/README.md)
