#!/bin/sh

echo -ne "Content-type:text/plain\r\n"
echo -ne "\r\n" # end of HTTP header

# ============== get value from mvaas.xml ================
groupid=`grep 'system_location_groupid' ../mvaas.xml | sed 's/<system_location_groupid>\(.*\)<\/system_location_groupid>/\1/'`
deviceid=`grep 'system_location_deviceid' ../mvaas.xml | sed 's/<system_location_deviceid>\(.*\)<\/system_location_deviceid>/\1/'`
hostname=`confclient -p 99 -g system_hostname|awk -F'=' '{print $2}'`
serveraddr=`grep 'system_mvaas_registerserver_address' ../mvaas.xml | sed 's/<system_mvaas_registerserver_address>\(.*\)<\/system_mvaas_registerserver_address>/\1/'`
serverport=`grep 'system_mvaas_registerserver_port' ../mvaas.xml | sed 's/<system_mvaas_registerserver_port>\(.*\)<\/system_mvaas_registerserver_port>/\1/'`
logserveraddr=`grep 'system_mvaas_logserver_address' ../mvaas.xml | sed 's/<system_mvaas_logserver_address>\(.*\)<\/system_mvaas_logserver_address>/\1/'`
logserverport=`grep 'system_mvaas_logserver_port' ../mvaas.xml | sed 's/<system_mvaas_logserver_port>\(.*\)<\/system_mvaas_logserver_port>/\1/'`
redirecturl=`grep 'system_mvaas_redirecturl' ../mvaas.xml | sed 's/<system_mvaas_redirecturl>\(.*\)<\/system_mvaas_redirecturl>/\1/'`
# ============== Get name and url from confclient, and store in string. UI will parse them. ==============
vadp_max_num=10
c=0
firstone=1
Nullnum=0
myselfnum=`readlink -f $0 | cut -d'/' -f5`
while [ $c -lt $vadp_max_num ]
do
        name=`confclient -p 99 -g vadp_module_i"$c"_name | cut -d "=" -f2`
        url=`confclient -p 99 -g vadp_module_i"$c"_url | cut -d "=" -f2`
        if [ ! -z "$url" ] && [ $c -ne $myselfnum ];then
        	if [ $firstone -eq 1 ];then
				vadpnameurl=$name" ("$url")"
				firstone=0
            else
				vadpnameurl=$vadpnameurl","$name" ("$url")"
            fi
		else
			Nullnum=$(($Nullnum+1))
        fi
        c=$(($c+1))
done
vadpnum=$(($vadp_max_num-$Nullnum))

echo "system_hostname='${hostname}'"
echo "system_location_groupid='${groupid}'"
echo "system_location_deviceid='${deviceid}'"
echo "system_mvaas_registerserver_address='${serveraddr}'"
echo "system_mvaas_registerserver_port='${serverport}'"
echo "system_mvaas_logserver_address='${logserveraddr}'"
echo "system_mvaas_logserver_port='${logserverport}'"
echo "system_mvaas_redirecturl='${redirecturl}'"
echo "vadp_module_number='${vadpnum}'"
echo "vadp_module_name_and_url='${vadpnameurl}'"
exit 0
