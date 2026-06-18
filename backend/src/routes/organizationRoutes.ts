import { Router } from 'express';
import { getOrganizations, getOrganizationBySlug } from '../controllers/organizationController';

const router = Router();

router.route('/')
  .get(getOrganizations);

router.route('/:slug')
  .get(getOrganizationBySlug);

export default router;
