import { useEffect } from 'react';
import "./Popup.css";
import { Button } from '@/components/ui/button';
import { local, managed, session, sync } from '@/utils/useStorage';

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

export default function () {
  useEffect(() => {
    console.log("Hello from the popup!");
  }, []);

  return (
    <div className='w-80'>
      <Button>BUTTON</Button>
      <Button className='bg-secondary'>BUTTON</Button>
      <img src="/icon-with-shadow.svg" />
      <h1>vite-plugin-web-extension</h1>
      <p>
        Template: <code>react-ts</code>
      </p>
    </div>
  )
}
