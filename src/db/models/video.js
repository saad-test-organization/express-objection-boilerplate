import { Model } from 'objection';
import Channel from './channel.js';

class Video extends Model {
  static get tableName() {
    return 'video';
  }

  static get relationMappings() {
    return {
      channel: {
        relation: Model.BelongsToOneRelation,
        modelClass: Channel,
        join: {
          from: 'video.channelId',
          to: 'channel.id',
        },
      },
    };
  }
}

export default Video;
