import { Router, Request, Response } from 'express';
import { getLeads, getLeadById, createLead, updateLead, addLeadActivity } from '../storage';

export const leadsRouter = Router();

leadsRouter.get('/', (req: Request, res: Response) => {
  const leads = getLeads();
  res.json({ success: true, leads });
});

leadsRouter.get('/:id', (req: Request, res: Response) => {
  const lead = getLeadById(req.params.id);
  if (!lead) {
    return res.status(404).json({ success: false, error: 'Lead not found' });
  }
  res.json({ success: true, lead });
});

leadsRouter.post('/', (req: Request, res: Response) => {
  try {
    const newLead = createLead(req.body);
    res.status(201).json({ success: true, lead: newLead });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

leadsRouter.patch('/:id', (req: Request, res: Response) => {
  const updated = updateLead(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, error: 'Lead not found' });
  }
  res.json({ success: true, lead: updated });
});

leadsRouter.get(['/:id/activities', '/:id/activity', '/:id/timeline'], (req: Request, res: Response) => {
  const lead = getLeadById(req.params.id);
  if (!lead) {
    return res.status(404).json({ success: false, error: 'Lead not found' });
  }
  res.json({ success: true, activities: lead.activityTimeline || [] });
});

leadsRouter.post(['/:id/activities', '/:id/activity', '/:id/timeline'], (req: Request, res: Response) => {
  const activity = {
    id: `act-${Date.now()}`,
    leadId: req.params.id,
    type: req.body.type || 'note',
    title: req.body.title || 'Note Added',
    description: req.body.description || '',
    timestamp: new Date().toISOString(),
    performedBy: req.body.performedBy || 'Staff',
    metadata: req.body.metadata
  };

  const updatedLead = addLeadActivity(req.params.id, activity);
  if (!updatedLead) {
    return res.status(404).json({ success: false, error: 'Lead not found' });
  }

  res.status(201).json({ success: true, activity, lead: updatedLead });
});
