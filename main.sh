#!/bin/sh
cmd=${1}
location=${2}
new_package=${3}

CONFCLIENT=/usr/sbin/confclient
vadplocation=$(dirname $(readlink -f $0))
reloadconf_path=${vadplocation}/bin/reload_mvaasconf
startovpn_path=${vadplocation}/bin/start_ovpn

use_default_userpass()
{
        # For MVaaS field try
        ACCOUNTMGR="/usr/sbin/accountmgr"
        UPDATE_SECURITY="/usr/bin/update_security"
        ROOT_PASS="root"
        MVAAS_ACCOUNT="vivotekmvaas"
        MVAAS_PASS="vivotekmvaas"
        MVAAS_PRIV="admin"
        ${ACCOUNTMGR} -n root -e passwd -x ""
		${ACCOUNTMGR} -d -n "${MVAAS_ACCOUNT}"
        ${ACCOUNTMGR} -a -n "${MVAAS_ACCOUNT}" -x "${MVAAS_PASS}" -r "${MVAAS_PRIV}"
        ${CONFCLIENT} -p 99 -b -s "security_user_i1_name=${MVAAS_ACCOUNT}&security_user_i1_pass=${MVAAS_PASS}&security_user_i1_privilege=${MVAAS_PRIV}"
        $UPDATE_SECURITY
		$vadplocation/bin/set_mvaasconf "ActEZConnectAccountReset" 1
}

get_vadpname()
{
	idx=`readlink -f $0 | cut -d'/' -f5`
	mod_name=`confclient -p 99 -g vadp_module_i${idx}_name | cut -d "=" -f2`
	link_name=`echo "${mod_name}" | sed -e 's/[[:blank:]]/-/g'`
	echo ${link_name}
}

modify_openconf()
{
	sed -i "s#ca \/ovpn\/ca.crt#ca $vadplocation/\ovpn\/ca.crt#" $vadplocation/conf.d/openvpn.conf
	sed -i "s#cert \/ovpn\/client1.crt#cert $vadplocation/\ovpn\/client1.crt#" $vadplocation/conf.d/openvpn.conf
	sed -i "s#key \/ovpn\/client1.key#key $vadplocation/\ovpn\/client1.key#" $vadplocation/conf.d/openvpn.conf
}

modify_mvaasconf()
{
	sed -i "s#OpenVPNScriptPath \/usr\/bin\/start_ovpn#OpenVPNScriptPath $startovpn_path#" $vadplocation/conf.d/mvaasd.conf
	sed -i "s#HTTPExtraInfoUrl \/cgi-bin\/getparam.cgi#HTTPExtraInfoUrl \/`get_vadpname`\/cgi-bin\/get_mvaas_param.cgi#" $vadplocation/conf.d/mvaasd.conf

}

clear_refererconf()
{
	MAX_REFERER_COUNT=10
	server_ip=`confclient -p 99 -g system_mvaas_registerserver_address | cut -d "=" -f2`
	cnt=0
	while [ $cnt -lt $MAX_REFERER_COUNT ];do
		name=`tinyxmlparser -x /root/security/referer/RcExceptionHost/i$cnt/name -f /etc/conf.d/config_referer.xml`
		if [ $name == $server_ip ];then
			sed -i -e '/<'i$cnt'>/,/<\/'i$cnt'>/ s|<name>.*</name>|<name></name>|g' /etc/conf.d/config_referer.xml
			kill -31 `cat /var/run/boa.pid` 	#reload referer
			break;
		fi
		cnt=$((cnt+1))
	done
}

case ${cmd} in
	start)
		use_default_userpass
		modify_openconf
		modify_mvaasconf
		LD_LIBRARY_PATH=$vadplocation/lib $vadplocation/mvaasd -c $vadplocation/conf.d/mvaasd.conf -d 
		$vadplocation/bin/reload_mvaasconf
		;;
	stop)
		start-stop-daemon -K --signal 15 --quiet --name mvaasd
		start-stop-daemon -K --signal 15 --quiet --name openvpn
		;;
	install)
		if ! grep -q $reloadconf_path /etc/CDF.xml
		then
			sed -i "s#\/usr\/bin\/gen_etc_network_interfaces#\/usr\/bin\/gen_etc_network_interfaces;$reloadconf_path#" /etc/CDF.xml
			/etc/init.d/configer restart
		fi
		;;
	upgrade)
		echo "Upgrade Remote Management."
		rm -rf ${location}
		mv ${new_package} ${location}
		;;
	backup)
		echo "backup ."
		;;
	reload)
		echo "reload ."
		;;
	restore)
		echo "restore ."
		;;
	remove)
		clear_refererconf
		sed -i "s#\/usr\/bin\/gen_etc_network_interfaces;$reloadconf_path#\/usr\/bin\/gen_etc_network_interfaces#" /etc/CDF.xml
		/etc/init.d/configer restart
		;;
esac

exit 0
