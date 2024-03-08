import { Model } from 'objection';
import Channel from './channel.js'; 

class User extends Model {
  static get tableName() {
    return 'user';
  }

  static get relationMappings() {
    return {
      channel: {
        relation: Model.BelongsToOneRelation,
        modelClass: Channel,
        join: {
          from: 'user.channelId',
          to: 'channel.id',
        },
      },
    };
  }
}

export default User;
