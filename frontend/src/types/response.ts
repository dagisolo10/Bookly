import { Booking, Business, Service, User } from "./models";

import { ApiMessage, ApiResult } from "@/lib/api/api-response";

/**
 *  Message Response
 */

export type MessageResponse = ApiResult<ApiMessage>;

/**
 *  User Response
 */

export type UserResponse = ApiResult<User>;

/**
 *  Owner - Business Response
 */

export type OwnerBusinessResponse = ApiResult<Business>;
export type OwnerBusinessListResponse = ApiResult<Business[]>;

/**
 *  Owner - Service Response
 */

export type OwnerServiceResponse = ApiResult<Service>;

/**
 *  Owner - Booking Response
 */

export type OwnerBookingResponse = ApiResult<Booking>;
export type OwnerBookingListResponse = ApiResult<Booking[]>;
