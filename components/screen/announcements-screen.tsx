import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { AnnouncementCard } from '../announcements/announcement-card';
import AnnouncementSlot, { AnnouncementStatus } from '@/lib/announcement-slot';

import { Banner } from '../announcement-banner/banner';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useAuth } from '@/lib/auth/auth-context';
import { fetchEntity, searchEntities } from '@/lib/helpers/utils';
import { operatorEnum } from '@/types/api';
export default function AnnouncementScreen() {
  const { user } = useAuth();

  const {
    data: UserData,
    isSuccess,
    isLoading,
  } = useQuery({
    queryKey: [`getUserCoursesInfo ${user?.id}`],
    queryFn: async () => {
      const response = await fetchEntity('users', String(user?.id), ['user_courses']);
      if (response.status === 200) {
        return response.data;
      }
    },
    enabled: !!user,
  });

  const { refetch, fetchNextPage, hasNextPage, data } = useInfiniteQuery({
    initialPageParam: 1,
    queryKey: ['fetchAnnouncement'],
    queryFn: ({ pageParam }) => {
      const userCourses = UserData?.data.user_courses;
      return searchEntities(
        'announcements',
        { page: pageParam, size: 6, expand: ['created_by'], sorts: ['-is_pinned', '-created_at'] },
        {
          filter_params: [
            {
              field_name: 'course',
              operator: operatorEnum.in,
              value: userCourses.map((uc: any) => uc.course).join(),
            },
          ],
        }
      );
    },
    refetchOnWindowFocus: false,
    getNextPageParam: (lastPage, pages) => {
      return lastPage.data.links.next ? pages.length + 1 : undefined;
    },
  });

  return (
    <ScrollView
      style={{ flex: 1, padding: 16 }}
      contentContainerStyle={{ gap: 12, paddingBottom: 40 }}>
      {/*<Banner />*/}
      {data?.pages.map((page) =>
        page.data.data.map((announcement: any) => (
          <AnnouncementCard key={announcement.id} slot={announcement} />
        ))
      )}
    </ScrollView>
  );
}
