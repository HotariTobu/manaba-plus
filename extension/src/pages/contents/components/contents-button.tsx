import { Button } from "@/components/ui/button";
import { t } from "@/utils/i18n";
import browser from "webextension-polyfill";

export const ContentsButton = () => (
  <Button asChild>
    <a href={browser.runtime.getURL('src/pages/contents/index.html')} target="_blank">{t('contents_page_button')}</a>
  </Button>
)
