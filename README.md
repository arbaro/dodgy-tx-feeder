# Dodgy TX Feeder

NodeJS app which listens to transactions related to the Arbaro contract and writes to MongoDB via Mongoose.
This is for test/development purposes only and not fit for production.

Can use DemuxJS via Nodeos locally or Dfuse if on mainnet.
Array of 'handlers' which specify what actions to listen to, intiiating Demux or Dfuse accordingly both outputting a standard payload defined in interface `GenericTX` in `src/interfaces.ts`
