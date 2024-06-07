import { useEffect, useRef } from 'react';
import { throttle } from 'radash';
import logger from '/imports/startup/client/logger';
import {
  VIDEO_STREAMS_SUBSCRIPTION,
  VideoStreamsResponse,
} from './queries';
import { setStreams } from './state';
import { AdapterProps } from '../../components-data/graphqlToMiniMongoAdapterManager/component';
import useDeduplicatedSubscription from '/imports/ui/core/hooks/useDeduplicatedSubscription';

const throttledSetStreams = throttle({ interval: 500 }, setStreams);

const VideoStreamAdapter: React.FC<AdapterProps> = ({
  onReady,
  children,
}) => {
  const ready = useRef(false);
  const { data, loading, error } = useDeduplicatedSubscription<VideoStreamsResponse>(VIDEO_STREAMS_SUBSCRIPTION);

  useEffect(() => {
    if (loading) return;

    if (error) {
      logger.error(`Video streams subscription failed. ${error.name}: ${error.message}`, error);
    }

    if (!data) {
      throttledSetStreams([]);
      return;
    }

    const streams = data.user_camera.map(({ streamId, user, voice }) => ({
      stream: streamId,
      deviceId: streamId.split('_')[3],
      name: user.name,
      nameSortable: user.nameSortable,
      userId: user.userId,
      user,
      floor: voice?.floor ?? false,
      lastFloorTime: voice?.lastFloorTime ?? '0',
      type: 'stream' as const,
    }));

    throttledSetStreams(streams);
  }, [data]);

  useEffect(() => {
    if (!ready.current) {
      ready.current = true;
      onReady('VideoStreamAdapter');
    }
  }, [loading]);

  return children;
};

export default VideoStreamAdapter;
