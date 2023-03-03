const { SlashCommandBuilder } = require("discord.js");
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const pgnParser = require("pgn-parser");

const ce = {
  DS: "<:DS:1075448861629362247>",
  DSDR: "<:DSDR:1075448854834577419>",
  LSDR: "<:LSDR:1075448854041858098>",
  DSDN: "<:DSDN:1075448868117954681>",
  LSDN: "<:LSDN:1075448868969390243>",
  DSDB: "<:DSDB:1075448871423070330>",
  LSDB: "<:LSDB:1075448860853403648>",
  DSDQ: "<:DSDQ:1075448863453880360>",
  LSDQ: "<:LSDQ:1075448866742206574>",
  DSDK: "<:DSDK:1075448865823670332>",
  LSDK: "<:LSDK:1075448864687001620>",
  DSDP: "<:DSDP:1075448862417891328>",
  LSDP: "<:LSDP:1075448877697728573>",
  LS: "<:LS:1075448859813224448>",
  LSLR: "<:LSLR:1075448858659786833>",
  DSLR: "<:DSLR:1075448876363960442>",
  LSLN: "<:LSLN:1075448879086051378>",
  DSLN: "<:DSLN:1075448874283585597>",
  LSLB: "<:LSLB:1075448870466752562>",
  DSLB: "<:DSLB:1075448872320639076>",
  LSLQ: "<:LSLQ:1075448857544118292>",
  DSLQ: "<:DSLQ:1075448858349412362>",
  LSLK: "<:LSLK:1075448873444708442>",
  DSLK: "<:DSLK:1075448869623701554>",
  LSLP: "<:LSLP:1075448875772551258>",
  DSLP: "<:DSLP:1075448856357122088>",
};

function simulateChessboard(bo, black) {
  let board = bo.map((element) => {
    if (element === null) {
      return { type: "square" };
    } else {
      return element;
    }
  });

  let arr = [];
  board.forEach((e) => {
    const white = [
      1, 3, 5, 7, 10, 12, 14, 16, 17, 19, 21, 23, 26, 28, 30, 32, 33, 35, 37,
      39, 42, 44, 46, 48, 49, 51, 53, 55, 58, 60, 62, 64,
    ];
    const isWhite = white.includes(board.indexOf(e) + 1);
    let lineend =
      board.indexOf(e) + 1 == 8 ||
      board.indexOf(e) + 1 == 16 ||
      board.indexOf(e) + 1 == 24 ||
      board.indexOf(e) + 1 == 32 ||
      board.indexOf(e) + 1 == 40 ||
      board.indexOf(e) + 1 == 48 ||
      board.indexOf(e) + 1 == 56
        ? "\n"
        : "";
    if (black) {
      arr.push(
        e && e.color
          ? `${lineend}[${isWhite ? "l" : "d"}s${e.color}${e.type}]`
          : `${lineend}[${isWhite ? "l" : "d"}s]`
      );
    } else {
      arr.push(
        e && e.color
          ? `[${isWhite ? "l" : "d"}s${e.color}${e.type}]${lineend}`
          : `[${isWhite ? "l" : "d"}s]${lineend}`
      );
    }
  });

  if (black) arr = arr.reverse();
  const sim = arr.join("");
  const boardsim = sim
    .replaceAll("[ls]", ce.LS)
    .replaceAll("[ds]", ce.DS)
    .replaceAll("[lsbr]", ce.LSDR)
    .replaceAll("[dsbr]", ce.DSDR)
    .replaceAll("[dswr]", ce.DSLR)
    .replaceAll("[lswr]", ce.LSLR)
    .replaceAll("[lsbn]", ce.LSDN)
    .replaceAll("[dsbn]", ce.DSDN)
    .replaceAll("[dswn]", ce.DSLN)
    .replaceAll("[lswn]", ce.LSLN)
    .replaceAll("[lsbb]", ce.LSDB)
    .replaceAll("[dsbb]", ce.DSDB)
    .replaceAll("[dswb]", ce.DSLB)
    .replaceAll("[lswb]", ce.LSLB)
    .replaceAll("[lsbq]", ce.LSDQ)
    .replaceAll("[dsbq]", ce.DSDQ)
    .replaceAll("[dswq]", ce.DSLQ)
    .replaceAll("[lswq]", ce.LSLQ)
    .replaceAll("[lsbk]", ce.LSDK)
    .replaceAll("[dsbk]", ce.DSDK)
    .replaceAll("[dswk]", ce.DSLK)
    .replaceAll("[lswk]", ce.LSLK)
    .replaceAll("[lsbp]", ce.LSDP)
    .replaceAll("[dsbp]", ce.DSDP)
    .replaceAll("[lswp]", ce.LSLP)
    .replaceAll("[dswp]", ce.DSLP);
  return boardsim;
}

module.exports.help = {
  name: "chessview",
  category: "Utility",
  description: "Simulate a chess game using PGN.",
  required: "None",
  usage: "/chessview <pgn>",
};

module.exports.data = new SlashCommandBuilder()
  .setName("chessview")
  .setDescription("Simulate a chess game using PGN.")
  .addStringOption((option) =>
    option
      .setName("pgn")
      .setDescription("The PGN text of the game")
      .setRequired(true)
  );

module.exports.run = async (client, interaction, options) => {
  let black = false;
  let pgn = options.getString("pgn");
  let pgnJSON;
  try {
    pgnJSON = pgnParser.parse(pgn);
  } catch (e) {
    return interaction.editReply("Invalid PGN text.");
  }
  const Chess = await import("chess.js");
  const chess = new Chess.Chess();
  const bo = chess.board().flat(1);
  const boardsim = simulateChessboard(bo);
  interaction.editReply({
    embeds: [new EmbedBuilder().setDescription(boardsim)],
  });

  const whitename = pgnJSON[0]["headers"].find((h) => h.name == "White").value;
  const blackname = pgnJSON[0]["headers"].find((h) => h.name == "Black").value;
  const whiteelo = pgnJSON[0]["headers"].find(
    (h) => h.name == "WhiteElo"
  ).value;
  const blackelo = pgnJSON[0]["headers"].find(
    (h) => h.name == "BlackElo"
  ).value;
  const endmessage = pgnJSON[0]["headers"].find(
    (h) => h.name == "Termination"
  ).value;

  pgnJSON[0]["moves"].forEach((m, i) => {
    const ended =
      pgnJSON[0]["moves"].indexOf(m) == pgnJSON[0]["moves"].length - 1
        ? `**` + endmessage + `!**`
        : false;
    const mo = m.move_number
      ? "White plays: `" + m.move + "`"
      : "Black plays: `" + m.move + "`";
    const moveorend = ended ? ended : mo;

    setTimeout(() => {
      chess.move(m.move);
      const bo = chess.board().flat(1);
      const boardsim = simulateChessboard(bo, black);
      const boardtext =
        `> <:WhiteKing:1076835914128564244>**White:** ${whitename} (${whiteelo})\n> <:BlackKing:1076835915256827947>**Black: **${blackname} (${blackelo})\n` +
        moveorend;
      const board = boardsim;

      interaction.editReply({
        content: boardtext,
        embeds: [new EmbedBuilder().setDescription(board)],
        components: [
          new ActionRowBuilder().addComponents([
            new ButtonBuilder()
              .setEmoji("1080467178601590875")
              .setStyle(2)
              .setLabel("Flip Board")
              .setCustomId(`flip`),
          ]),
        ],
      });
    }, i * 1500);
  });
  const filter = (i) =>
    i.customId == "flip" && i.user.id === interaction.user.id;

  const collector = interaction.channel.createMessageComponentCollector({
    filter,
    time: 60000,
  });

  collector.on("collect", (i) => {
    black = black ? false : true;
    i.deferUpdate();
  });
};
