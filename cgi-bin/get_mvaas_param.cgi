#!/bin/sh
find_result_url()     # Since we pass index from UI, find the url from confclient.
{
        c=0
        myselfnum=`readlink -f $0 | cut -d'/' -f5`
        flagindex=0
        vadp_max_num=10
        if [ $redirecturl == "0" ];then
                redirecturl="index.html"
        else
                while [ $c -lt $vadp_max_num ]
                do
                        name=`confclient -p 99 -g vadp_module_i"$c"_name | cut -d'=' -f2`
                        url=`confclient -p 99 -g vadp_module_i"$c"_url | cut -d'=' -f2`
                        if [ ! -z "$url" ] && [ $c -ne $myselfnum ];then
                                flagindex=$(($flagindex+1))
                        fi
                        if [ $redirecturl -eq $flagindex ];then
                                redirecturl=$url
                                break
                        fi
                        c=$(($c+1))
                done
        fi
}

echo -ne "Content-type:text/plain\r\n"
echo -ne "\r\n" # end of HTTP header

groupid=`grep 'system_location_groupid' ../mvaas.xml | sed 's/<system_location_groupid>\(.*\)<\/system_location_groupid>/\1/'`
deviceid=`grep 'system_location_deviceid' ../mvaas.xml | sed 's/<system_location_deviceid>\(.*\)<\/system_location_deviceid>/\1/'`
hostname=`confclient -p 99 -g system_hostname|awk -F'=' '{print $2}'`
serveraddr=`grep 'system_mvaas_registerserver_address' ../mvaas.xml | sed 's/<system_mvaas_registerserver_address>\(.*\)<\/system_mvaas_registerserver_address>/\1/'`
serverport=`grep 'system_mvaas_registerserver_port' ../mvaas.xml | sed 's/<system_mvaas_registerserver_port>\(.*\)<\/system_mvaas_registerserver_port>/\1/'`
logserveraddr=`grep 'system_mvaas_logserver_address' ../mvaas.xml | sed 's/<system_mvaas_logserver_address>\(.*\)<\/system_mvaas_logserver_address>/\1/'`
logserverport=`grep 'system_mvaas_logserver_port' ../mvaas.xml | sed 's/<system_mvaas_logserver_port>\(.*\)<\/system_mvaas_logserver_port>/\1/'`
redirecturl=`grep 'system_mvaas_redirecturl' ../mvaas.xml | sed 's/<system_mvaas_redirecturl>\(.*\)<\/system_mvaas_redirecturl>/\1/'`
find_result_url

echo "system_hostname='${hostname}'"
echo "system_location_groupid='${groupid}'"
echo "system_location_deviceid='${deviceid}'"
echo "system_mvaas_registerserver_address='${serveraddr}'"
echo "system_mvaas_registerserver_port='${serverport}'"
echo "system_mvaas_logserver_address='${logserveraddr}'"
echo "system_mvaas_logserver_port='${logserverport}'"
echo "redirect_url='${redirecturl}'"
exit 0
