const roms = {
  "Super Mario Bros. (W) [t3].nes": {},
  "Snow Brothers (U) [t2].nes": {},
  "Contra (U) [t3].nes": {},
  "Super Contra (J) [t2].nes": {},
  "Chip to Dale no Daisakusen (J) [t2].nes": {},
  "Chip 'n Dale Rescue Rangers 2 (U) [t1].nes": {},
  "Double Dragon II - The Revenge (U) (PRG1) [t1].nes": {},
  "Double Dragon III - The Sacred Stones (U) [t1].nes": {},
  "Teenage Mutant Ninja Turtles II - The Arcade Game (U) [t1].nes": {},
  "Guevara (J) [t1].nes": {},
  "Contra Force (U) [t6].nes": {},
  "Tetris (Tengen) [!].nes": {},
};

export default {
  roms: roms,
  defaultDirectory: './roms/',
  frameRate: 40,
  serverUrl: 'wss://saki-test-app.herokuapp.com/?room=${roomId}',
};
