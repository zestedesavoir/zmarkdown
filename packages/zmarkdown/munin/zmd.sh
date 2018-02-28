#!/bin/bash

# ln -s /path/to/this/folder/zmd.sh /etc/munin/plugins/zmd_status
# ln -s /path/to/this/folder/zmd.sh /etc/munin/plugins/zmd_memory
# ln -s /path/to/this/folder/zmd.sh /etc/munin/plugins/zmd_cpu
# ln -s /path/to/this/folder/zmd.sh /etc/munin/plugins/zmd_event_loop_lag
# ln -s /path/to/this/folder/zmd.sh /etc/munin/plugins/zmd_req_per_process
# ln -s /path/to/this/folder/zmd.sh /etc/munin/plugins/zmd_avg_per_process
# ln -s /path/to/this/folder/zmd.sh /etc/munin/plugins/zmd_req_per_endpoint
# ln -s /path/to/this/folder/zmd.sh /etc/munin/plugins/zmd_avg_per_endpoint

destination=`basename $0 | sed 's/^zmd_//g'`

if [ "$1" = "config" ]; then
  wget -qO- http://localhost:27272/munin/config/$destination
else
  wget -qO- http://localhost:27272/munin/$destination
fi
