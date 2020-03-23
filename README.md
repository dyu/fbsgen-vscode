## Generate (multiple) files using fbsgen-ds templates

The ```templates``` dir should placed in the root dir of your project

```templates/hello/{{name}}.ts.stg```
```ts
import "fbsgen/base"
import "fbsgen/dict"

p_block(p, module) ::= <<
«p_main_block(p, module, p.("name"), p.("dir_name"))»
>>

p_main_block(p, module, name, dir_name) ::= <<

export class «name» {
    
    constructor() {
        
    }
    init() {
        // TODO
    }
}
>>
```

```templates/hello/{{name}}Foo.ts.stg```
```ts
import "fbsgen/base"
import "fbsgen/dict"

p_block(p, module) ::= <<
«p_main_block(p, module, p.("name"), p.("dir_name"))»
>>

p_main_block(p, module, name, dir_name) ::= <<

export class «name»Foo {
    
    constructor() {
        
    }
    init() {
        // TODO
    }
}
>>
```
