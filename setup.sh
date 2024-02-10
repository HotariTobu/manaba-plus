for p in **/.*.sample; do
  cp -n "$p" "${p%.sample}"
done
