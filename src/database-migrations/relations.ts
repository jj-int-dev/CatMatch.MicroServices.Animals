import { relations } from 'drizzle-orm/relations';
import {
  ssoProvidersInAuth,
  ssoDomainsInAuth,
  samlProvidersInAuth,
  usersInAuth,
  mfaFactorsInAuth,
  sessionsInAuth,
  refreshTokensInAuth,
  flowStateInAuth,
  samlRelayStatesInAuth,
  mfaAmrClaimsInAuth,
  identitiesInAuth,
  oneTimeTokensInAuth,
  mfaChallengesInAuth,
  users,
  userTypes,
  messages,
  conversations,
  animals,
  animalPhotos,
  swipes,
  userSearchPreferences,
  notifications,
  animalsAdopted
} from './schema';

export const ssoDomainsInAuthRelations = relations(
  ssoDomainsInAuth,
  ({ one }) => ({
    ssoProvidersInAuth: one(ssoProvidersInAuth, {
      fields: [ssoDomainsInAuth.ssoProviderId],
      references: [ssoProvidersInAuth.id]
    })
  })
);

export const ssoProvidersInAuthRelations = relations(
  ssoProvidersInAuth,
  ({ many }) => ({
    ssoDomainsInAuths: many(ssoDomainsInAuth),
    samlProvidersInAuths: many(samlProvidersInAuth),
    samlRelayStatesInAuths: many(samlRelayStatesInAuth)
  })
);

export const samlProvidersInAuthRelations = relations(
  samlProvidersInAuth,
  ({ one }) => ({
    ssoProvidersInAuth: one(ssoProvidersInAuth, {
      fields: [samlProvidersInAuth.ssoProviderId],
      references: [ssoProvidersInAuth.id]
    })
  })
);

export const mfaFactorsInAuthRelations = relations(
  mfaFactorsInAuth,
  ({ one, many }) => ({
    usersInAuth: one(usersInAuth, {
      fields: [mfaFactorsInAuth.userId],
      references: [usersInAuth.id]
    }),
    mfaChallengesInAuths: many(mfaChallengesInAuth)
  })
);

export const usersInAuthRelations = relations(usersInAuth, ({ many }) => ({
  mfaFactorsInAuths: many(mfaFactorsInAuth),
  sessionsInAuths: many(sessionsInAuth),
  identitiesInAuths: many(identitiesInAuth),
  oneTimeTokensInAuths: many(oneTimeTokensInAuth),
  users: many(users)
}));

export const refreshTokensInAuthRelations = relations(
  refreshTokensInAuth,
  ({ one }) => ({
    sessionsInAuth: one(sessionsInAuth, {
      fields: [refreshTokensInAuth.sessionId],
      references: [sessionsInAuth.id]
    })
  })
);

export const sessionsInAuthRelations = relations(
  sessionsInAuth,
  ({ one, many }) => ({
    refreshTokensInAuths: many(refreshTokensInAuth),
    usersInAuth: one(usersInAuth, {
      fields: [sessionsInAuth.userId],
      references: [usersInAuth.id]
    }),
    mfaAmrClaimsInAuths: many(mfaAmrClaimsInAuth)
  })
);

export const samlRelayStatesInAuthRelations = relations(
  samlRelayStatesInAuth,
  ({ one }) => ({
    flowStateInAuth: one(flowStateInAuth, {
      fields: [samlRelayStatesInAuth.flowStateId],
      references: [flowStateInAuth.id]
    }),
    ssoProvidersInAuth: one(ssoProvidersInAuth, {
      fields: [samlRelayStatesInAuth.ssoProviderId],
      references: [ssoProvidersInAuth.id]
    })
  })
);

export const flowStateInAuthRelations = relations(
  flowStateInAuth,
  ({ many }) => ({
    samlRelayStatesInAuths: many(samlRelayStatesInAuth)
  })
);

export const mfaAmrClaimsInAuthRelations = relations(
  mfaAmrClaimsInAuth,
  ({ one }) => ({
    sessionsInAuth: one(sessionsInAuth, {
      fields: [mfaAmrClaimsInAuth.sessionId],
      references: [sessionsInAuth.id]
    })
  })
);

export const identitiesInAuthRelations = relations(
  identitiesInAuth,
  ({ one }) => ({
    usersInAuth: one(usersInAuth, {
      fields: [identitiesInAuth.userId],
      references: [usersInAuth.id]
    })
  })
);

export const oneTimeTokensInAuthRelations = relations(
  oneTimeTokensInAuth,
  ({ one }) => ({
    usersInAuth: one(usersInAuth, {
      fields: [oneTimeTokensInAuth.userId],
      references: [usersInAuth.id]
    })
  })
);

export const mfaChallengesInAuthRelations = relations(
  mfaChallengesInAuth,
  ({ one }) => ({
    mfaFactorsInAuth: one(mfaFactorsInAuth, {
      fields: [mfaChallengesInAuth.factorId],
      references: [mfaFactorsInAuth.id]
    })
  })
);

export const usersRelations = relations(users, ({ one, many }) => ({
  usersInAuth: one(usersInAuth, {
    fields: [users.userId],
    references: [usersInAuth.id]
  }),
  userType: one(userTypes, {
    fields: [users.userTypeId],
    references: [userTypes.userTypeId]
  }),
  messages: many(messages),
  conversations_adopterId: many(conversations, {
    relationName: 'conversations_adopterId_users_userId'
  }),
  conversations_rehomerId: many(conversations, {
    relationName: 'conversations_rehomerId_users_userId'
  }),
  swipes_potentialAdopterId: many(swipes, {
    relationName: 'swipes_potentialAdopterId_users_userId'
  }),
  swipes_rehomerId: many(swipes, {
    relationName: 'swipes_rehomerId_users_userId'
  }),
  userSearchPreferences: many(userSearchPreferences),
  notifications: many(notifications),
  animalsAdopteds: many(animalsAdopted),
  animals: many(animals)
}));

export const userTypesRelations = relations(userTypes, ({ many }) => ({
  users: many(users)
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  user: one(users, {
    fields: [messages.senderId],
    references: [users.userId]
  }),
  conversation: one(conversations, {
    fields: [messages.conversationId],
    references: [conversations.conversationId]
  })
}));

export const conversationsRelations = relations(
  conversations,
  ({ one, many }) => ({
    messages: many(messages),
    user_adopterId: one(users, {
      fields: [conversations.adopterId],
      references: [users.userId],
      relationName: 'conversations_adopterId_users_userId'
    }),
    user_rehomerId: one(users, {
      fields: [conversations.rehomerId],
      references: [users.userId],
      relationName: 'conversations_rehomerId_users_userId'
    })
  })
);

export const animalPhotosRelations = relations(animalPhotos, ({ one }) => ({
  animal: one(animals, {
    fields: [animalPhotos.animalId],
    references: [animals.animalId]
  })
}));

export const animalsRelations = relations(animals, ({ one, many }) => ({
  animalPhotos: many(animalPhotos),
  swipes: many(swipes),
  animalsAdopteds: many(animalsAdopted),
  user: one(users, {
    fields: [animals.rehomerId],
    references: [users.userId]
  })
}));

export const swipesRelations = relations(swipes, ({ one }) => ({
  user_potentialAdopterId: one(users, {
    fields: [swipes.potentialAdopterId],
    references: [users.userId],
    relationName: 'swipes_potentialAdopterId_users_userId'
  }),
  user_rehomerId: one(users, {
    fields: [swipes.rehomerId],
    references: [users.userId],
    relationName: 'swipes_rehomerId_users_userId'
  }),
  animal: one(animals, {
    fields: [swipes.animalId],
    references: [animals.animalId]
  })
}));

export const userSearchPreferencesRelations = relations(
  userSearchPreferences,
  ({ one }) => ({
    user: one(users, {
      fields: [userSearchPreferences.userId],
      references: [users.userId]
    })
  })
);

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.targetUserId],
    references: [users.userId]
  })
}));

export const animalsAdoptedRelations = relations(animalsAdopted, ({ one }) => ({
  animal: one(animals, {
    fields: [animalsAdopted.animalId],
    references: [animals.animalId]
  }),
  user: one(users, {
    fields: [animalsAdopted.rehomerId],
    references: [users.userId]
  })
}));
