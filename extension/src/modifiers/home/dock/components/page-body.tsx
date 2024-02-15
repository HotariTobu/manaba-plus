const getKeyOf = (element: Element) => {
  const entries = Array.from(element.attributes).map(attribute => {
    return [attribute.name, attribute.value]
  })
  entries.push(['tagName', element.tagName])
  const obj = Object.fromEntries(entries)
  return JSON.stringify(obj)
}

export const PageBody = (props: { elements: Element[] }) => {
  return (
    <div>
      {props.elements.map(e => (
        <div dangerouslySetInnerHTML={{ __html: e.outerHTML }} key={getKeyOf(e)} />
      ))}
    </div>
  )
}
