#!/bin/zsh
# https://imagemagick.org/script/index.php
# https://web.dev/serve-responsive-images/

# loop through images
for filename in to_convert/*.png
do
	# get new filename
	substring=$(echo "$filename" | cut -f 1 -d '.')
	small_filename="${substring}_small.jpg"
	medium_filename="${substring}_medium.jpg"
	# convert image to small and medium
	convert -resize 10% -background white -flatten $filename $small_filename
	convert -resize 50% -background white -flatten $filename $medium_filename
	echo $small_filename
	echo $medium_filename
done



