# hexo-renderer-asciidoctor

A Hexo renderer that uses `asciidoctor` as an external procees inside docker to do the rendering.

## Running

1. Install this plugin into your `hexo` site.

```sh
npm install --save hexo-renderer-asciidoctor
```

2. Make sure that the link:bin/asciidoctor[asciidoctor launch script] is in your path.

3. Write articles using the `asciidoctor` packaged in docker.

## Cool UML, and ASCII Art Rendering

Because asciidoctor is being ran with the actual binary, beside simple text formatting, such as bold/italic/underline, it also has access to all the native plugins available that are packaged in the docker image, including `PlantUML`.

Thus you can write in your article stuff like:

```text
[plantuml, /documents/public/assets/simple-class-uml, svg]
----------------------------------------------------------------------------
class A<T> <<singleton>> {
    {abstract} -int x
    {static} #void meta()
}

class B

A <|-- B
----------------------------------------------------------------------------
```

and that will be correctly be rendered as:

![Simple Class UML](https://cdn.rawgit.com/bmustiata/hexo-renderer-asciidoctor/master/demo/simple-class-uml.svg)

and the image link will have its `/documents/public` prefix stripped out, so if will appear correctly in the page.

