import os
import numpy as _N

ROUNDS_INCOMPLETE    = 1
COMPLETED_3_ROUNDS     = 2
COMPLETED_MENTAL_STATE = 3
GAMES                  = 40

class TMBdataset:
    #  status
    participantID = None
    filename_w_path = None
    DQ1  = None
    AQ29 = None
    STARTED_ROUNDS = False
    visit_status = None  # 1    visit_status = []   makes this like a static variable
    completed_visits = None
    round_dats   = None
    player_wtl   = None
    cats         = None
    
    cum_rps      = None

    def __init__(self, partid, dirname):
        #  looking for DQ1.txt

        self.visit_status = []
        self.participantID = partid
        self.filename_w_path = dirname

        if os.access("%s/DQ1.txt" % dirname, os.F_OK):
            self.DQ1  = True
        if os.access("%s/AQ29.txt" % dirname, os.F_OK):
            self.AQ29 = True

        visit = 1
        visitdir = "%(d)s/%(v)d" % {"d" : dirname, "v" : visit}
        while os.access(visitdir, os.F_OK):
            self.visit_status.append(ROUNDS_INCOMPLETE)
            self.STARTED_ROUNDS = True
            #  do we have some of the expected files
            if os.access("%s/block1_AI.dat" % visitdir, os.F_OK) and os.access("%s/block2_AI.dat" % visitdir, os.F_OK) and os.access("%s/block3_AI.dat" % visitdir, os.F_OK):
                self.visit_status[visit-1] = COMPLETED_3_ROUNDS
                if os.access("%s/MentalState.txt" % visitdir, os.F_OK):
                    self.visit_status[visit-1] = COMPLETED_MENTAL_STATE

            visit += 1
            visitdir = "%(d)s/%(v)d" % {"d" : dirname, "v" : visit}
        if visit == 1:   #  
            self.STARTED_ROUNDS = False

        completed_visits = visit - 1
        self.player_wtl   = _N.zeros((completed_visits, 3, GAMES))
        self.cum_rps   = _N.zeros((completed_visits, 3, 3, GAMES+1), dtype=_N.int)
        self.cats         = _N.zeros((completed_visits, 3))

        for visit in range(1, completed_visits+1):
            visitdir = "%(d)s/%(v)d" % {"d" : dirname, "v" : visit}

            ###  read data for the 3 rounds
            if self.visit_status[visit-1] >= COMPLETED_3_ROUNDS:
                for rnd in range(3):
                    fp = open("%(s)s/block%(r)d_AI.dat" % {"s" : visitdir, "r" : rnd+1}, "r")

                    fp.readline()
                    cnstr = fp.readline()
                    if cnstr[0] == 'W':
                        cat_col = 0
                    elif cnstr[0] == 'M':
                        cat_col = 1
                    elif cnstr[0] == 'F':
                        cat_col = 2

                    player = fp.readline()
                    AI = fp.readline()
                    playerNN = player[:-2].split(" ")
                    AINN = AI[:-2].split(" ")
                    #moves[ie-1, :, 0] = AINN
                    #moves[ie-1, :, 1] = playerNN

                    # #  print("*** categorie   %d" % cat[ie-1, rnd-1])
                    # for hlf in range(2):
                    #     print("hlf   %d" % hlf)
                    #     it0 = hlf*GAMES//2
                    #     it1 = (hlf+1)*GAMES//2
                    #     AI_R = _N.where(moves[ie-1, it0:it1, 0] == 'R')[0]
                    #     AI_S = _N.where(moves[ie-1, it0:it1, 0] == 'S')[0]
                    #     AI_P = _N.where(moves[ie-1, it0:it1, 0] == 'P')[0]
                    #     pl_R = _N.where(moves[ie-1, it0:it1, 1] == 'R')[0]
                    #     pl_S = _N.where(moves[ie-1, it0:it1, 1] == 'S')[0]
                    #     pl_P = _N.where(moves[ie-1, it0:it1, 1] == 'P')[0]
                    # player_cats[ie-1, rnd-1] = cat[ie-1, rnd-1]

                    for g in range(GAMES):
                        #  rock vs paper, player loses
                        ##  player 1 (R) and AI 2 (S)    == player wins
                        if ((playerNN[g] == 'R') and (AINN[g] == 'S')) or \
                           ((playerNN[g] == 'S') and (AINN[g] == 'P')) or \
                           ((playerNN[g] == 'P') and (AINN[g] == 'R')):
                            self.player_wtl[visit-1, cat_col, g] = 1
                        elif ((playerNN[g] == 'R') and (AINN[g] == 'P')) or \
                           ((playerNN[g] == 'P') and (AINN[g] == 'S')) or \
                           ((playerNN[g] == 'S') and (AINN[g] == 'R')):
                            self.player_wtl[visit-1, cat_col, g] = -1
                        else:
                            self.player_wtl[visit-1, cat_col, g] = 0
                        if playerNN[g] == 'R':
                            self.cum_rps[visit-1, cat_col, 0, g+1] = self.cum_rps[visit-1, cat_col, 0, g] + 1
                            self.cum_rps[visit-1, cat_col, 1, g+1] = self.cum_rps[visit-1, cat_col, 1, g]
                            self.cum_rps[visit-1, cat_col, 2, g+1] = self.cum_rps[visit-1, cat_col, 2, g]
                        elif playerNN[g] == 'S':
                            self.cum_rps[visit-1, cat_col, 0, g+1] = self.cum_rps[visit-1, cat_col, 0, g]
                            self.cum_rps[visit-1, cat_col, 1, g+1] = self.cum_rps[visit-1, cat_col, 1, g]+1
                            self.cum_rps[visit-1, cat_col, 2, g+1] = self.cum_rps[visit-1, cat_col, 2, g]
                        elif playerNN[g] == 'P':
                            self.cum_rps[visit-1, cat_col, 0, g+1] = self.cum_rps[visit-1, cat_col, 0, g]
                            self.cum_rps[visit-1, cat_col, 1, g+1] = self.cum_rps[visit-1, cat_col, 1, g]
                            self.cum_rps[visit-1, cat_col, 2, g+1] = self.cum_rps[visit-1, cat_col, 2, g]+1

                    fp.close()

