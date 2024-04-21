import { Button } from '@/components/ui/button';
import { mount } from "@/utils/mount";
import { useDownload } from './hooks/useDownload';
import { ContentsTree } from './components/contents-tree';
import { Toaster } from 'sonner';

const App = () => {
  const { downloading, contentsStats, contentsItems, startDownload, cancelDownload } = useDownload()

  return (
    <>
      <div className='flex'>
        <div className='flex flex-col'>
          {downloading ? (
            <Button onClick={cancelDownload}>ダウンロードをキャンセルする</Button>
          ) : (
            <Button onClick={startDownload}>ダウンロードを開始する</Button>
          )}
          <div>
            {JSON.stringify(contentsStats)}
          </div>
        </div>
        <div className='flex-1'>
          <ContentsTree contentsItems={contentsItems} />
        </div>
      </div>
      <Toaster richColors />
    </>
  )
}

mount(<App />, '#app')
