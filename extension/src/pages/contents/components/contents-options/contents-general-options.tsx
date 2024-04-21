import { useStoreValue } from "@/hooks/useStoreValue"
import { localStore, store } from "../../store"
import { t } from "@/utils/i18n"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { ScrapingNodeId, scrapingNodeIdEnum } from "../../model"
import { Button } from "@/components/ui/button"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

// TODO: Dynamic rendering

export const ContentsGeneralOptions = () => {
  const [downloadDestination, setDownloadDestination] = useStoreValue(store, 'downloadDestination')
  const [downloadLimit, setDownloadLimit] = useStoreValue(store, 'downloadLimit')

  const [downloadStarredOnly, setDownloadStarredOnly] = useStoreValue(store, 'downloadStarredOnly')
  const [downloadHiddenToo, setDownloadHiddenToo] = useStoreValue(store, 'downloadHiddenToo')

  const [defaultIgnoredSet, setDefaultIgnoredSet] = useStoreValue(store, 'defaultIgnoredSet')

  const deleteDownloadHistory = () => {
    localStore.excludedSet = new Set()
    localStore.lastDownloadTime = null
  }

  return (
    <div className="mx-3 my-1 gap-y-8 grid grid-cols-[1fr_16rem]">
      <div className="gap-y-2 grid grid-cols-subgrid grid-rows-subgrid col-span-2 row-span-2">
        <div className="text-base">{t('contents_options_downloadDestination_title')}</div>
        <Input value={downloadDestination} onChange={e => setDownloadDestination(e.target.value)} />
        <div className="text-sm opacity-60 col-span-2">{t('contents_options_downloadDestination_description')}</div>
      </div>

      <div className="gap-y-2 grid grid-cols-subgrid grid-rows-subgrid col-span-2 row-span-2">
        <div className="text-base">{t('contents_options_downloadLimit_title')}</div>
        <Input value={downloadLimit} onChange={e => setDownloadLimit(parseInt(e.target.value))} type="number" min={1} />
        <div className="text-sm opacity-60 col-span-2">{t('contents_options_downloadLimit_description')}</div>
      </div>

      <div className="gap-y-2 grid grid-cols-subgrid grid-rows-subgrid col-span-2 row-span-2">
        <div className="text-base">{t('contents_options_downloadStarredOnly_title')}</div>
        <Switch className="ms-auto" checked={downloadStarredOnly} onCheckedChange={setDownloadStarredOnly} />
        <div className="text-sm opacity-60 col-span-2">{t('contents_options_downloadStarredOnly_description')}</div>
      </div>

      <div className="gap-y-2 grid grid-cols-subgrid grid-rows-subgrid col-span-2 row-span-2">
        <div className="text-base">{t('contents_options_downloadHiddenToo_title')}</div>
        <Switch className="ms-auto" checked={downloadHiddenToo} onCheckedChange={setDownloadHiddenToo} />
        <div className="text-sm opacity-60 col-span-2">{t('contents_options_downloadHiddenToo_description')}</div>
      </div>

      <Separator className="my-4 col-span-2" orientation="horizontal" />

      {Object.keys(scrapingNodeIdEnum).map(id => (
        <div className="gap-y-2 grid grid-cols-subgrid grid-rows-subgrid col-span-2 row-span-2" key={id}>
          <div className="text-base">{t(`contents_options_download_${id}_title`)}</div>
          <Switch className="ms-auto" checked={!defaultIgnoredSet.has(id as ScrapingNodeId)} onCheckedChange={checked => {
            if (checked) {
              setDefaultIgnoredSet(new Set(
                Array.from(defaultIgnoredSet).filter(i => i !== id)
              ))
            }
            else {
              setDefaultIgnoredSet(new Set(
                Array.from(defaultIgnoredSet).concat(id as ScrapingNodeId)
              ))
            }
          }} />
          <div className="text-sm opacity-60 col-span-2">{t(`contents_options_download_${id}_description`)}</div>
        </div>
      ))}

      <Separator className="my-4 col-span-2" orientation="horizontal" />


      <div className="gap-y-2 grid grid-cols-subgrid grid-rows-subgrid col-span-2 row-span-2">
        <div className="text-base">{t('contents_options_delete_history_title')}</div>
        <AlertDialog>
          <Button asChild>
            <AlertDialogTrigger>
              {t('contents_options_delete_history_alert_action')}
            </AlertDialogTrigger>
          </Button>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t('contents_options_delete_history_alert_title')}</AlertDialogTitle>
              <AlertDialogDescription>{t('contents_options_delete_history_alert_description')}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t('contents_options_delete_history_alert_cancel')}</AlertDialogCancel>
              <AlertDialogAction onClick={deleteDownloadHistory}>{t('contents_options_delete_history_alert_action')}</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <div className="text-sm opacity-60 col-span-2">{t('contents_options_delete_history_description')}</div>
      </div>

    </div>
  )
}
