import os
import TMBdataset as tmbdat
import re
import numpy as _N
import matplotlib.pyplot as _plt

dirlist = os.listdir("../DATA/TMB1")

ROUNDS = 3
complete_dat = []
for directory in dirlist:
    if os.path.isdir("../DATA/TMB1/%s" % directory):
        days = os.listdir("../DATA/TMB1/%s" % directory)
        for participant in days:
            ma = re.search(r"\d{8}_\d{4}-\d{2}_\d{4}\.\d{4}", participant)
            if ma is not None:
                #  check if files are there
                path_to_participant = "../DATA/TMB1/%(d)s/%(p)s" % {"p" : participant, "d" : directory}
                dat = tmbdat.TMBdataset(participant, path_to_participant)

                if dat.STARTED_ROUNDS and dat.visit_status[0] >= tmbdat.COMPLETED_3_ROUNDS:
                    complete_dat.append(dat)

#  now look at complete_dat
for cd in complete_dat:
    visits = len(cd.visit_status)
    

wtl_all = _N.zeros((ROUNDS, tmbdat.GAMES))

for cd in range(len(complete_dat)):
    wtl_all += complete_dat[cd].player_netwin[0]

wtl_all /= len(complete_dat)


fig = _plt.figure(figsize=(5, 8))
fig.add_subplot(3, 1, 1)
_plt.plot(wtl_all[0], color="black")
_plt.ylim(-1, 6)
_plt.axhline(y=0, ls=":")
_plt.title("WTL-type rule")
fig.add_subplot(3, 1, 2)
_plt.plot(wtl_all[1], color="black")
_plt.ylim(-1, 6)
_plt.axhline(y=0, ls=":")
_plt.title("mimic-type rule")
fig.add_subplot(3, 1, 3)
_plt.plot(wtl_all[2], color="black")
_plt.ylim(-1, 6)
_plt.axhline(y=0, ls=":")
_plt.title("random-bias rule")
_plt.savefig("doTMB")
fig.subplots_adjust(wspace=0.3, hspace=0.3)


