This plug-in replaces abbreviations.

```
This is an abbreviation: "REF".
ref and REFERENCE should be ignored.

*[REF]: Reference
```

->

```HTML
<p>This is an abbreviation: "<abbr title="Reference">REF</abbr>".
ref and REFERENCE should be ignored.</p>
```
