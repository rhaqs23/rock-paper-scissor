import { Component, Inject, OnInit } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

export interface WinnerData {
  roundWinner: string;
  finalResult: string;
  userScore: number;
  compScore: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Rock Paper Scissor';
  userScore = 0;
  compScore = 0;
  roundResult = '';
  toolArray = ['rock', 'paper', 'scissor'];
  try = 0;
  playerRock = undefined;
  playerPaper = undefined;
  playerScissor = undefined;
  compRock = undefined;
  compPaper = undefined;
  compScissor = undefined;
  winner = '';

  constructor(public dialog: MatDialog) {}

  ngOnInit() {
    this.openDialog();
    // console.log(this.randomIntFromInterval(0, 2));
  }

  openDialog() {
    // tslint:disable-next-line: no-use-before-declare
    this.dialog.open(EntryDialog);
  }

  openRoundWinnerDialog() {
    if (this.try >= 3) {
      this.declareWinner();
    }
    // tslint:disable-next-line: no-use-before-declare
    const dialogRef = this.dialog.open(RoundWinnerDialog, {
      width: '250px',
      data: {
              roundWinner: this.roundResult,
              finalResult: this.winner,
              userScore: this.userScore,
              compScore: this.compScore
            }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.roundResult = result;
    });
  }

  play(weapon: string) {
    if (this.try < 3) {
      this.roundResult = '';
      const randomIndex = this.getRandomNumber(0, 2);
      const compWeapon = this.toolArray[randomIndex];
      this.findWinner(weapon, compWeapon);
      this.try++;
      console.log('player: ' + weapon + ', Comp: ' + compWeapon);
      this.openRoundWinnerDialog();
    } else {
      // this.restart();
      return;
    }
  }

  declareWinner() {
    if (this.userScore < this.compScore) {
      this.winner = 'Computer Wins :-(, Hard luck';
    } else if (this.compScore < this.userScore) {
      this.winner = 'Congratulations :-) You are the winner !!';
    } else {
      this.winner = 'It is a draw!!'
    }
  }

  findWinner(weapon: string, compWeapon: string) {
    if (weapon === compWeapon) {
      this.resetButtons();
      this.roundResult = 'It is a Draw!!';
      return;
    }
    // tslint:disable-next-line: prefer-for-of
    const arraySize = this.toolArray.length;
    for (let i = 0; i < arraySize; i++) {
      if ((i < arraySize ) && (weapon === this.toolArray[i]) && (compWeapon === this.toolArray[i + 1])) {
        this.roundResult = 'Computer Beats You!!';
        this.changeStates('comp', compWeapon, 'player', weapon);
        return;
      } else if ((i !== 0) && (weapon === this.toolArray[i]) && (compWeapon === this.toolArray[i - 1])) {
        this.roundResult = 'You Beat Computer!!';
        this.changeStates('player', weapon, 'comp', compWeapon);
        return;
      } else if ((weapon === this.toolArray[i]) && (compWeapon === this.toolArray[i + 2])) {
        this.roundResult = 'You Beat Computer!!';
        this.changeStates('player', weapon, 'comp', compWeapon);
        return;
      } else if ((weapon === this.toolArray[i]) && (compWeapon === this.toolArray[i - 2])) {
        this.roundResult = 'Computer Beats You!!';
        this.changeStates('comp', compWeapon, 'player', weapon);
        return;
      }
    }
  }

  changeStates(firstPlayer: string, strongWeapon: string, seconPlayer: string, weakWeapon: string) {
    this.resetButtons();
    this.incrementScore(firstPlayer);
    this.setButtonColor(firstPlayer, strongWeapon, true);
    this.setButtonColor(seconPlayer, weakWeapon, false);
  }

  incrementScore(player: string) {
    if (player === 'player' && this.userScore < 3) {
      this.userScore++;
    } else if (player === 'comp' && this.compScore < 3) {
      this.compScore++;
    }
  }

  setButtonColor(player: string, weapon: string, state: boolean) {
    switch (weapon) {
      case 'rock' : if (player === 'player') {
                      this.playerRock = state;
                    } else {
                      this.compRock = state;
                    }
                    break;
      case 'paper' : if (player === 'player') {
                      this.playerPaper = state;
                    } else {
                      this.compPaper = state;
                    }
                     break;
      case 'scissor' : if (player === 'player') {
                      this.playerScissor = state;
                    } else {
                      this.compScissor = state;
                    }
                       break;
    }
  }

  resetButtons() {
      this.playerPaper = undefined;
      this.playerRock = undefined;
      this.playerScissor = undefined;
      this.compRock = undefined;
      this.compPaper = undefined;
      this.compScissor = undefined;
  }

  restart() {
    window.location.reload();
  }

  getRandomNumber(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }


}

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'Entry-dialog',
  templateUrl: 'entry-dialog.html',
})
// tslint:disable-next-line: component-class-suffix
export class EntryDialog {
  constructor(public dialogRef: MatDialogRef<EntryDialog>) {}
  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'round-winner-dialog',
  templateUrl: 'round-winner-dialog.html',
})
// tslint:disable-next-line: component-class-suffix
export class RoundWinnerDialog {

  constructor(
    public dialogRef: MatDialogRef<RoundWinnerDialog>,
    @Inject(MAT_DIALOG_DATA) public data: WinnerData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  restart() {
    window.location.reload();
  }
}

