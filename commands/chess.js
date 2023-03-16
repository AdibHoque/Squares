const { SlashCommandBuilder } = require("discord.js");
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");

function simulateChessboard(bo, black, ce) {
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
    let blineend =
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
          ? `${blineend}[${isWhite ? "l" : "d"}s${e.color}${e.type}]${
              board.indexOf(e) == 0
                ? " 8"
                : board.indexOf(e) == 8
                ? " 7"
                : board.indexOf(e) == 16
                ? " 6"
                : board.indexOf(e) == 24
                ? " 5"
                : board.indexOf(e) == 32
                ? " 4"
                : board.indexOf(e) == 40
                ? " 3"
                : board.indexOf(e) == 48
                ? " 2"
                : board.indexOf(e) == 56
                ? " 1"
                : ""
            }`
          : `${blineend}[${isWhite ? "l" : "d"}s]${
              board.indexOf(e) == 0
                ? " 8"
                : board.indexOf(e) == 8
                ? " 7"
                : board.indexOf(e) == 16
                ? " 6"
                : board.indexOf(e) == 24
                ? " 5"
                : board.indexOf(e) == 32
                ? " 4"
                : board.indexOf(e) == 40
                ? " 3"
                : board.indexOf(e) == 48
                ? " 2"
                : board.indexOf(e) == 56
                ? " 1"
                : ""
            }`
      );
    } else {
      arr.push(
        e && e.color
          ? `[${isWhite ? "l" : "d"}s${e.color}${e.type}]${
              board.indexOf(e) + 1 == 8
                ? " 8"
                : board.indexOf(e) + 1 == 16
                ? " 7"
                : board.indexOf(e) + 1 == 24
                ? " 6"
                : board.indexOf(e) + 1 == 32
                ? " 5"
                : board.indexOf(e) + 1 == 40
                ? " 4"
                : board.indexOf(e) + 1 == 48
                ? " 3"
                : board.indexOf(e) + 1 == 56
                ? " 2"
                : board.indexOf(e) + 1 == 64
                ? " 1"
                : ""
            }${lineend}`
          : `[${isWhite ? "l" : "d"}s]${
              board.indexOf(e) + 1 == 8
                ? " 8"
                : board.indexOf(e) + 1 == 16
                ? " 7"
                : board.indexOf(e) + 1 == 24
                ? " 6"
                : board.indexOf(e) + 1 == 32
                ? " 5"
                : board.indexOf(e) + 1 == 40
                ? " 4"
                : board.indexOf(e) + 1 == 48
                ? " 3"
                : board.indexOf(e) + 1 == 56
                ? " 2"
                : board.indexOf(e) + 1 == 64
                ? " 1"
                : ""
            }${lineend}`
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
  return (
    boardsim + (black ? "\n⠀h⠀g⠀f⠀ e ⠀d⠀ c⠀ b⠀a" : "\n⠀a⠀b⠀c⠀ d ⠀e⠀ f⠀ g⠀h")
  );
}

function startGame(interaction, chess, turn, opponent, ce) {
  const bcollector = interaction.channel.createMessageComponentCollector({
    time: 120000,
  });

  bcollector.on("collect", async (i) => {
    if (!i.deferred) await i.deferUpdate();
    if (i.customId == "cn") {
      await i.followUp({
        embeds: [
          new EmbedBuilder()
            .setTitle(
              `<:SquaresChess:1084820810813939772> **Squares Chess Notations**`
            )
            .setDescription(
              "Chess notations that you need to use in order to play Chess using Squares Chess command."
            )
            .addFields([
              {
                name: "Pieces",
                value:
                  "Pawns: `a`, `b`, `c`, `d`, `e`, `f`, `h`\nKing: `K`, Queen: `Q`, Rook: `R`, Bishop: `B`, Knight: `N`",
              },
              {
                name: "Moves",
                value:
                  "Pawns - FileSquare e.g. `e4`\nOther Pieces - PieceNotationFileSquare e.g. `Nf3`\n\nIf two of your same pieces can go to the same square - PieceNotationCurrentFileSquareMovingfileSquare e.g. `Nf3e5`",
              },
              {
                name: "Captures",
                value:
                  "Pawns - FilexFileSquare e.g. `exf5`\nOther Pieces - NotationFileSquarexFileSquare e.g. `Nf3xe5`",
              },
              {
                name: "Castling",
                value: `King side castle - \`O-O\`\nQueen side castle - \`O-O-O\``,
              },
              {
                name: "Promotion",
                value: "PawnFileSquare=PieceNoation e.g. `a8=Q`, `axb8=Q`",
              },
            ])
            .setColor("#7ca650"),
        ],
        ephemeral: true,
      });
    }
    if (i.customId == "bpov") {
      const bo = chess.board().flat(1);
      const boardb = simulateChessboard(bo, true, ce);
      await i.followUp({
        embeds: [new EmbedBuilder().setDescription(boardb).setColor("#7ca650")],
        ephemeral: true,
      });
    }
  });
  const filter = (m) =>
    m.author.id == (turn == "White" ? interaction.user.id : opponent.id);

  const collector = interaction.channel.createMessageCollector({
    filter,
    time: 120 * 1000,
  });
  collector.on("collect", async (m) => {
    try {
      chess.move(m.content);
    } catch (e) {
      m.delete();
      return interaction.editReply(
        `<@${m.author.id}>\`${m.content}\` by ${turn} is an Illegal move.`
      );
    }
    m.delete();
    if (chess.isCheckmate()) {
      chess.header(
        "Termination",
        `${
          turn == "White" ? interaction.user.username : opponent.username
        } won by Checkmate`
      );
      const bo = chess.board().flat(1);
      const boardsim = simulateChessboard(bo, false, ce);
      interaction.editReply({
        content: `${
          turn == "White"
            ? `<@` + interaction.user.id + `>`
            : `<@` + opponent.id + `>`
        } as ${turn} plays **${m.content}** and Wins with Checkmate!`,
        embeds: [
          new EmbedBuilder()
            .setDescription(
              `**White:** ${interaction.user.tag}\n**Black:** ${opponent.tag}\n` +
                boardsim
            )
            .setColor("#7ca650"),
        ],
        components: [],
      });
      interaction.channel.send({
        embeds: [gameRecord(chess)],
      });
      bcollector.stop("checkmate");
      collector.stop("moved");
      return;
    }
    if (chess.isStalemate()) {
      chess.header("Termination", `Game drew by Stalemate`);
      const bo = chess.board().flat(1);
      const boardsim = simulateChessboard(bo, false, ce);
      interaction.editReply({
        content: `${
          turn == "White"
            ? `<@` + interaction.user.id + `>`
            : `<@` + opponent.id + `>`
        } as ${turn} plays **${
          m.content
        }** and the game ends in a draw cause of Stalemate!`,
        embeds: [
          new EmbedBuilder()
            .setDescription(
              `**White:** ${interaction.user.tag}\n**Black:** ${opponent.tag}\n` +
                boardsim
            )
            .setColor("#7ca650"),
        ],
        components: [],
      });
      interaction.channel.send({
        embeds: [gameRecord(chess)],
      });
      bcollector.stop("stalemate");
      collector.stop("moved");
      return;
    }
    if (chess.isStalemate()) {
      chess.header("Termination", `Game drew by Stalemate`);
      const bo = chess.board().flat(1);
      const boardsim = simulateChessboard(bo, false, ce);
      interaction.editReply({
        content: `${
          turn == "White"
            ? `<@` + interaction.user.id + `>`
            : `<@` + opponent.id + `>`
        } as ${turn} plays **${
          m.content
        }** and the game ends in a draw cause of Stalemate!`,
        embeds: [
          new EmbedBuilder()
            .setDescription(
              `**White:** ${interaction.user.tag}\n**Black:** ${opponent.tag}\n` +
                boardsim
            )
            .setColor("#7ca650"),
        ],
        components: [],
      });
      interaction.channel.send({
        embeds: [gameRecord(chess)],
      });
      bcollector.stop("stalemate");
      collector.stop("moved");
      return;
    }

    const check = chess.inCheck();
    const bo = chess.board().flat(1);
    const boardsim = simulateChessboard(bo, false, ce);
    interaction.editReply({
      content:
        `${
          turn == "White"
            ? `<@` + interaction.user.id + `>`
            : `<@` + opponent.id + `>`
        } as ${turn} plays **${m.content}**${
          check
            ? ` which puts the ` +
              (turn == "White"
                ? "Black King in check!"
                : "White King in check!")
            : ""
        }` +
        `\n\n${
          turn == "White"
            ? "<@" + opponent.id + ">"
            : "<@" + interaction.user.id + ">"
        } make your move as ${
          turn == "White" ? "Black" : "White"
        }\n**Time Ends:** <t:${Math.floor(Date.now() / 1000) + 120}:T>, <t:${
          Math.floor(Date.now() / 1000) + 120
        }:R>`,
      embeds: [
        new EmbedBuilder()
          .setDescription(
            `**White:** ${interaction.user.tag}\n**Black:** ${opponent.tag}\n` +
              boardsim
          )
          .setColor("#7ca650"),
      ],
      components: [
        new ActionRowBuilder().addComponents([
          new ButtonBuilder()
            .setEmoji("1080467178601590875")
            .setStyle(2)
            .setLabel("Black POV")
            .setCustomId(`bpov`),
          new ButtonBuilder()
            .setEmoji("1084820810813939772")
            .setStyle(2)
            .setLabel("Notations")
            .setCustomId(`cn`),
        ]),
      ],
    });
    bcollector.stop("move done");
    collector.stop("moved");
    startGame(
      interaction,
      chess,
      turn == "White" ? "Black" : "White",
      opponent,
      ce
    );
  });

  collector.on("end", async (collected, reason) => {
    if (reason && reason === "time") {
      interaction.channel.send("Timed out");
    }
  });
}

function gameRecord(chess) {
  const embed = new EmbedBuilder()
    .setTitle("Game Records")
    .setDescription(
      "You can paste these in [Chess.com/analysis](https://www.chess.com/analysis) or [Lichess.org/analysis](https://lichess.org/analysis) for analysis and game review. You can also replay the game using `/chessview <PGN>` command."
    )
    .addFields([
      { name: "PGN", value: chess.pgn() + ` 1/2-1/2` },
      { name: "FEN", value: chess.fen() },
    ])
    .setColor("#7ca650");
  return embed;
}

module.exports.help = {
  name: "chess",
  category: "Entertainment",
  description: "Play a chess game!",
  required: "None",
  usage: "/chess <opponent>",
};

module.exports.data = new SlashCommandBuilder()
  .setName("chess")
  .setDescription("Play a chess game!")
  .addUserOption((option) =>
    option
      .setName("opponent")
      .setDescription("The person you wanna play against.")
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("theme")
      .setDescription("Select chessboard theme!")
      .setChoices(
        { name: "Neo Green (Default)", value: "neo" },
        { name: "Glass Icy Sea", value: "glass" }
      )
  );

module.exports.run = async (client, interaction, options) => {
  let opponent = options.getUser("opponent");
  const Chess = await import("chess.js");
  let theme = options.getString("theme");
  let ce = {
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

  if (theme && theme == "glass") {
    ce = {
      DS: "<:DS:1085261860116365383>",
      DSDR: "<:DSDR:1085502805504167947>",
      LSDR: "<:LSDR:1085502844704145488>",
      DSDN: "<:DSDN:1085502410442690670>",
      LSDN: "<:LSDN:1085502374371663933>",
      DSDB: "<:DSDB:1085502526939467796>",
      LSDB: "<:LSDB:1085502564864360548>",
      DSDQ: "<:DSDQ:1085503016964206644>",
      LSDQ: "<:LSDQ:1085502972701716480>",
      DSDK: "<:DSDK:1085503117933694998>",
      LSDK: "<:LSDK:1085503190574841867>",
      DSDP: "<:DSDP:1085497589916516393>",
      LSDP: "<:LSDP:1085262077112897596>",
      LS: "<:LS:1085261910213132389>",
      LSLR: "<:LSLR:1085502619352563732>",
      DSLR: "<:DSLR:1085502654425350245>",
      LSLN: "<:LSLN:1085502300442853376>",
      DSLN: "<:DSLN:1085502342717263943>",
      LSLB: "<:LSLB:1085502452633190470>",
      DSLB: "<:DSLB:1085502490440646706>",
      LSLQ: "<:LSLQ:1085502900555501618>",
      DSLQ: "<:DSLQ:1085502936412590080>",
      LSLK: "<:LSLK:1085503055115603988>",
      DSLK: "<:DSLK:1085503087634038804>",
      LSLP: "<:LSLP:1085261968170025054>",
      DSLP: "<:DSLP:1085262019751596113>",
    };
  }
  const embed = new EmbedBuilder()
    .setTitle("<:SquaresChess:1084820810813939772> Chess Game")
    .setDescription(
      `**${interaction.user.username}** is willing to have a Chess game with you!\nAccept or Decline their request using the buttons on this message.`
    )
    .setColor("#7ca650");
  const row = new ActionRowBuilder().addComponents([
    new ButtonBuilder().setStyle(3).setLabel("Accept").setCustomId(`accept`),
    new ButtonBuilder().setStyle(4).setLabel("Decline").setCustomId(`decline`),
  ]);

  interaction.editReply({
    content: `<@${opponent.id}>`,
    embeds: [embed],
    components: [row],
  });

  const filter = (i) => i.user.id === opponent.id;

  const collector = interaction.channel.createMessageComponentCollector({
    filter,
    time: 30000,
  });

  collector.on("collect", async (i) => {
    if (!i.deferred) await i.deferUpdate();
    if (i.customId == "accept") {
      const chess = new Chess.Chess();
      const bo = chess.board().flat(1);
      const boardsim = simulateChessboard(bo, false, ce);
      interaction.editReply({
        content: `<@${interaction.user.id}> as White pieces you get to do the first move!\nMake your move using the Chess Notations within 2 minutes.\n\nThe game goes on until Timeout, Checkmate, Stalemate, Threefold Repetition & Insufficient Material.`,
        embeds: [
          new EmbedBuilder()
            .setDescription(
              `**White:** ${interaction.user.tag}\n**Black:** ${opponent.tag}\n` +
                boardsim
            )
            .setColor("#7ca650"),
        ],
        components: [
          new ActionRowBuilder().addComponents([
            new ButtonBuilder()
              .setEmoji("1080467178601590875")
              .setStyle(2)
              .setLabel("Black POV")
              .setCustomId(`bpov`),
            new ButtonBuilder()
              .setEmoji("1084820810813939772")
              .setStyle(2)
              .setLabel("Notations")
              .setCustomId(`cn`),
          ]),
        ],
      });
      startGame(interaction, chess, "White", opponent, ce);
      chess.header("White", interaction.user.username);
      chess.header("Black", opponent.username);
      collector.stop("accepted");
    }
    if (i.customId == "decline") {
      i.channel.send("Chess game request has been declined.");
      collector.stop("declined");
    }
  });
};
