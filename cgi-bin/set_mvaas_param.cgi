#!/bin/sh
MAX_REFERER_COUNT=10
modify_refererconf()
{
	cnt=0
	while [ $cnt -lt $MAX_REFERER_COUNT ];do
		name=`tinyxmlparser -x /root/security/referer/RcExceptionHost/i$cnt/name -f /etc/conf.d/config_referer.xml`
		if [ "$name" == "$1" ];then
			break;
		fi
		if [ -z $name ];then
			sed -i -e '/<'i$cnt'>/,/<\/'i$cnt'>/ s|<name>.*</name>|<name>'$1'</name>|g' /etc/conf.d/config_referer.xml
			kill -31 `cat /var/run/boa.pid` 	#reload referer
			break
		fi
		cnt=$((cnt+1))
	done
	if [ $cnt -eq MAX_REFERER_COUNT ];then
		echo "status=full"
	fi
}

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
	param=`echo ${word} | cut -d "=" -f2`
	#echo "${key}=${param}"
	if [ "$key" == "system_mvaas_registerserver_address" ];then
		modify_refererconf $param
	fi
	sed -i 's/<'${key}'>.*</<'${key}'>'${param}'</' ../mvaas.xml
done
location=$(dirname $(readlink -f $0))
$location/../bin/reload_mvaasconf
