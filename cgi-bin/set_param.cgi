#!/bin/sh
if [ "$REQUEST_METHOD" = "POST" ]; then
  strparam=`cat $stdin | cut -c1-$CONTENT_LENGTH`
else
  strparam=$QUERY_STRING
fi

echo -ne "Content-type:text/plain\r\n"
echo -ne "\r\n" # end of HTTP header

strparam=`/usr/bin/decode.sh $strparam`
#echo ${strparam}
IFS="&"
for word in $strparam; do
	key=`echo ${word} | cut -d "=" -f1`
	param=`echo ${word} | cut -d '=' -f2`
	#echo "${key}=${param}"
	sed -i 's/<'${key}'>.*</<'${key}'>'${param}'</' ../mvaas.xml
done
location=$(dirname $(readlink -f $0))
$location/../bin/reload_mvaasconf
