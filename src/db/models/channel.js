import { Model } from 'objection';
import Video from './video.js';

class Channel extends Model {
  static get tableName() {
    return 'channel';
  }

  static get relationMappings() {
    return {
      videos: {
        relation: Model.HasManyRelation,
        modelClass: Video,
        join: {
          from: 'channel.id',
          to: 'video.channelId',
        },
      },
    };
  }
}

export default Channel;