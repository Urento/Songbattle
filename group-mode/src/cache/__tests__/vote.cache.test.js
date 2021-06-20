const VoteCache = require("../vote.cache");
let id;
let songlink; //https://open.spotify.com/track/${songID}
let socketId;

const generate = () => {
  return (
    new Date().getTime().toString(36) + Math.random().toString(36).slice(2)
  );
};

describe("Vote Cache", () => {
  beforeEach(() => {
    id = generate();
    songlink = "https://open.spotify.com/track/" + generate();
    socketId = generate();
  });

  afterEach(() => {
    id = "";
    (songlink = ""), (socketId = "");
  });

  test("add vote to cache", async () => {
    const voteCache = new VoteCache.VoteCache();
    const vote = new VoteCache.Vote(id, songlink, socketId);
    await voteCache.addVote(vote);
    const exists = await voteCache.hasVoted(socketId);
    const v = await voteCache.getVoteObject(socketId);

    expect(exists).toBe(true);
    expect(voteCache.votes.size).toBe(1);
    expect(v.songlink).toBe(songlink);
    expect(v.socketId).toBe(socketId);
    expect(v.id).toBe(id);
  });

  test("add vote to cache and remove it", async () => {
    const voteCache = new VoteCache.VoteCache();
    const vote = new VoteCache.Vote(id, songlink, socketId);
    await voteCache.addVote(vote);
    const v = await voteCache.getVoteObject(socketId);
    const exists1 = await voteCache.hasVoted(socketId);
    await voteCache.removeVote(socketId);
    const exists2 = await voteCache.hasVoted(socketId);

    expect(exists1).toBe(true);
    expect(exists2).toBe(false);
    expect(voteCache.votes.size).toBe(0);
    expect(v.songlink).toBe(songlink);
    expect(v.socketId).toBe(socketId);
    expect(v.id).toBe(id);
  });
});
