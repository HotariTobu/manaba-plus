import { local, managed, session, sync } from '@/utils/useStorage';
import { mount } from "@/utils/mount";
import { Button } from '@/components/ui/button';

debug: {
  const areas = {
    local: local,
    managed: managed,
    session: session,
    sync: sync,
  }
  for (const [name, area] of Object.entries(areas)) {
    const values = await area.get()
    console.log(name)
    console.log(values)
  }
}

function Popup() {
  return (
    <div className='w-80'>
      <Button onClick={() => sync.clear()}>BUTTON</Button>
      <Button className='bg-secondary'>BUTTON</Button>
      <img src="/icon-with-shadow.svg" />
      <h1>vite-plugin-web-extension</h1>
      <p>
        Template: <code>react-ts</code>
      </p>
    </div>
  )
}

mount(<Popup />, '#app')
