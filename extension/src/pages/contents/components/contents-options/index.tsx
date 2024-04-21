import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { GearIcon } from "@radix-ui/react-icons"
import { ContentsGeneralOptions } from "./contents-general-options"
import { t } from "@/utils/i18n"

export const ContentsOptions = () => {
  return (
    <Dialog>
      <Button variant="outline" asChild>
        <DialogTrigger>
          <GearIcon className="w-4 h-4 me-2" />
          {t('contents_options_dialog_trigger')}
        </DialogTrigger>
      </Button>
      <DialogContent className="max-w-2xl max-h-[80vh] grid-rows-[auto_minmax(0,_1fr)]">
        <DialogHeader>
          <DialogTitle>{t('contents_options_dialog_title')}</DialogTitle>
          <DialogDescription>{t('contents_options_dialog_description')}</DialogDescription>
        </DialogHeader>
        <ScrollArea>
          <ContentsGeneralOptions />
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
