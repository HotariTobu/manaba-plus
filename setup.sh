for p in **/.*.sample; do
  cp "$p" "${p%.sample}"
done
