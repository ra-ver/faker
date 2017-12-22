<h1 align="center"> Faker </h1> <br>

<p align="center">
Tool for generating Fake JSON data
</p>

## Table of Contents

- [Introduction](#introduction)
- [Quick Start](#quickstart)

## Introduction

This program uses npm package: [json-schema-faker](https://www.npmjs.com/package/json-schema-faker) to generate fake json data

* All schemas are stored in [schemas folder](schemas)
* Samples objects that are used to generate some of the schemas are stored in [sample-objects](sample-objects)
    
    * Another npm package: [json-schemas-generator](https://www.npmjs.com/package/json-schema-generator) is used to generate such schemas from their corresponding sample obejcts

## Quick Start

Run faker using:

```node -r babel-register index.js config.json```

or

```npm start config.json```

