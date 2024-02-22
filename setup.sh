for p in **/.*.sample; do
  echo $(cp -nv "$p" "${p%.sample}")
done
