"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Complaint,
  MasterIssue,
  WorkOrder,
  VerificationRun,
  Camera,
  EnvironmentalMetric,
  AuditEvent,
  UserRole,
  HumanReviewDecision,
  ComplaintCategory
} from '@ground0/types';
import {
  INITIAL_COMPLAINTS,
  INITIAL_MASTER_ISSUES,
  INITIAL_WORK_ORDERS,
  INITIAL_VERIFICATION_RUNS,
  INITIAL_CAMERAS,
  INITIAL_SUSTAINABILITY,
  INITIAL_AUDIT_EVENTS
} from './store';

interface DataContextType {
  role: UserRole;
  setRole: (r: UserRole) => void;
  complaints: Complaint[];
  masterIssues: MasterIssue[];
  workOrders: WorkOrder[];
  verificationRuns: VerificationRun[];
  cameras: Camera[];
  sustainability: EnvironmentalMetric[];
  auditEvents: AuditEvent[];
  submitComplaint: (data: {
    category: ComplaintCategory;
    description: string;
    latitude: number;
    longitude: number;
    address: string;
    mediaUrl?: string;
  }) => Promise<Complaint>;
  createWorkOrder: (data: {
    masterIssueId?: string;
    title: string;
    description: string;
    category: ComplaintCategory;
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    requirements: string[];
  }) => Promise<WorkOrder>;
  submitEvidenceAndVerify: (
    workOrderId: string,
    beforeImage: string,
    afterImage: string,
    capturedLat: number,
    capturedLon: number
  ) => Promise<VerificationRun>;
  conductHumanReview: (
    verificationRunId: string,
    workOrderId: string,
    decision: HumanReviewDecision,
    notes: string
  ) => Promise<void>;
  submitCitizenFeedback: (
    complaintId: string,
    isSolved: boolean,
    feedbackNotes: string
  ) => Promise<void>;
  toggleCameraPrivacy: (cameraId: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<UserRole>('INSPECTOR'); // default inspector for rich view
  const [complaints, setComplaints] = useState<Complaint[]>(INITIAL_COMPLAINTS);
  const [masterIssues, setMasterIssues] = useState<MasterIssue[]>(INITIAL_MASTER_ISSUES);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(INITIAL_WORK_ORDERS);
  const [verificationRuns, setVerificationRuns] = useState<VerificationRun[]>(INITIAL_VERIFICATION_RUNS);
  const [cameras, setCameras] = useState<Camera[]>(INITIAL_CAMERAS);
  const [sustainability, setSustainability] = useState<EnvironmentalMetric[]>(INITIAL_SUSTAINABILITY);
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>(INITIAL_AUDIT_EVENTS);

  // Initialize from LocalStorage if present
  useEffect(() => {
    try {
      const storedComplaints = localStorage.getItem('ground0_complaints');
      if (storedComplaints) setComplaints(JSON.parse(storedComplaints));

      const storedWorkOrders = localStorage.getItem('ground0_work_orders');
      if (storedWorkOrders) setWorkOrders(JSON.parse(storedWorkOrders));

      const storedVerifications = localStorage.getItem('ground0_verifications');
      if (storedVerifications) setVerificationRuns(JSON.parse(storedVerifications));
    } catch {
      // Local storage unavailable
    }
  }, []);

  const saveToStorage = (key: string, data: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch {
      // Ignore
    }
  };

  const submitComplaint = async (data: {
    category: ComplaintCategory;
    description: string;
    latitude: number;
    longitude: number;
    address: string;
    mediaUrl?: string;
  }): Promise<Complaint> => {
    const trackingNum = `GR0-${Math.floor(1000 + Math.random() * 9000)}`;
    const newId = `comp-${Date.now()}`;

    // AI triage calculation
    let aiConf = 0.92;
    let aiSev: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'HIGH';
    if (data.category === 'POTHOLE' || data.category === 'ILLEGAL_DUMPING') {
      aiSev = 'HIGH';
      aiConf = 0.94;
    }

    const newComplaint: Complaint = {
      id: newId,
      tracking_number: trackingNum,
      category: data.category,
      description: data.description,
      latitude: data.latitude,
      longitude: data.longitude,
      address: data.address,
      severity: aiSev,
      status: 'SUBMITTED',
      ai_predicted_category: data.category,
      ai_confidence: aiConf,
      ai_severity: aiSev,
      ai_notes: `Ground0 Visual AI analyzed report for ${data.category} at ${data.address}. High confidence triage.`,
      duplicate_cluster_score: 0.15,
      weather_context: { condition: 'Clear', temp_c: 19.0 },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      media: data.mediaUrl ? [
        {
          id: `med-${Date.now()}`,
          complaint_id: newId,
          storage_path: data.mediaUrl,
          media_type: 'image/jpeg',
          file_size_bytes: 1850000,
          sha256_hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
          is_primary: true,
          created_at: new Date().toISOString()
        }
      ] : []
    };

    const updated = [newComplaint, ...complaints];
    setComplaints(updated);
    saveToStorage('ground0_complaints', updated);

    // Record audit event
    const audit: AuditEvent = {
      id: `aud-${Date.now()}`,
      action: 'CITIZEN_COMPLAINT_CREATED',
      resource_type: 'complaint',
      resource_id: newId,
      details: { tracking_number: trackingNum, category: data.category },
      created_at: new Date().toISOString()
    };
    setAuditEvents([audit, ...auditEvents]);

    return newComplaint;
  };

  const createWorkOrder = async (data: {
    masterIssueId?: string;
    title: string;
    description: string;
    category: ComplaintCategory;
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    requirements: string[];
  }): Promise<WorkOrder> => {
    const woNum = `WO-${Math.floor(2000 + Math.random() * 8000)}`;
    const newId = `wo-${Date.now()}`;

    const newWO: WorkOrder = {
      id: newId,
      organization_id: '11111111-1111-1111-1111-111111111111',
      master_issue_id: data.masterIssueId,
      work_order_number: woNum,
      title: data.title,
      description: data.description,
      category: data.category,
      priority: data.priority,
      status: 'ASSIGNED',
      camera_verification_enabled: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      requirements: data.requirements.map((r, i) => ({
        id: `req-${Date.now()}-${i}`,
        work_order_id: newId,
        title: r,
        criterion_type: 'PHYSICAL_REPAIR',
        is_mandatory: true,
        is_satisfied: false,
        created_at: new Date().toISOString()
      }))
    };

    const updated = [newWO, ...workOrders];
    setWorkOrders(updated);
    saveToStorage('ground0_work_orders', updated);
    return newWO;
  };

  const submitEvidenceAndVerify = async (
    workOrderId: string,
    beforeImage: string,
    afterImage: string,
    capturedLat: number,
    capturedLon: number
  ): Promise<VerificationRun> => {
    const runId = `vr-${Date.now()}`;

    // Test for replay attack if same image
    const isReplay = beforeImage === afterImage;
    const sceneMatch = isReplay ? 100.0 : 93.8;
    const changeScore = isReplay ? 0.0 : 91.2;
    const overallConf = isReplay ? 0.12 : 0.945;
    const riskLvl = isReplay ? 'CRITICAL' : 'LOW';
    const rec = isReplay ? 'EVIDENCE_CONFLICT' : 'READY_FOR_APPROVAL';

    const newRun: VerificationRun = {
      id: runId,
      work_order_id: workOrderId,
      status: 'COMPLETED',
      current_stage: 'RECOMMENDATION',
      overall_confidence: overallConf,
      risk_score: 1.0 - overallConf,
      ai_recommendation: rec,
      explanation_summary: isReplay
        ? 'Ground0 Verification Alert: Perceptual replay detected. After media is identical to Before media. Work rejected.'
        : `Ground0 Verification: Location verified (3.8m), Scene Match ${sceneMatch}%, Fresh Evidence confirmed, Physical Change ${changeScore}%, Requirements satisfied. Risk Level: ${riskLvl}. Ready for human inspector sign-off.`,
      started_at: new Date(Date.now() - 60000).toISOString(),
      completed_at: new Date().toISOString(),
      result: {
        id: `res-${Date.now()}`,
        verification_run_id: runId,
        scene_match_percentage: sceneMatch,
        physical_change_percentage: changeScore,
        requirement_score: isReplay ? 0.0 : 0.96,
        difference_mask_storage_path: '/artifacts/diff_mask_sample.png',
        heatmap_storage_path: '/artifacts/heatmap_sample.png',
        gemini_audit_report: isReplay
          ? 'Multimodal analysis flagged zero physical delta. Rejecting evidence.'
          : 'Multimodal analysis confirms complete physical restoration. Edge seals and compaction verified.'
      },
      steps: [
        { id: `s1-${Date.now()}`, verification_run_id: runId, step_name: 'INTEGRITY_CHECK', step_order: 1, status: isReplay ? 'FAILED' : 'PASSED', score: isReplay ? 0.0 : 1.0 },
        { id: `s2-${Date.now()}`, verification_run_id: runId, step_name: 'LOCATION_CHECK', step_order: 2, status: 'PASSED', score: 0.98 },
        { id: `s3-${Date.now()}`, verification_run_id: runId, step_name: 'SCENE_MATCH', step_order: 3, status: 'PASSED', score: sceneMatch / 100 },
        { id: `s4-${Date.now()}`, verification_run_id: runId, step_name: 'CHANGE_DETECTION', step_order: 4, status: isReplay ? 'FAILED' : 'PASSED', score: changeScore / 100 },
        { id: `s5-${Date.now()}`, verification_run_id: runId, step_name: 'REQUIREMENT_ANALYSIS', step_order: 5, status: isReplay ? 'FAILED' : 'PASSED', score: isReplay ? 0.0 : 0.95 },
        { id: `s6-${Date.now()}`, verification_run_id: runId, step_name: 'CAMERA_CORROBORATION', step_order: 6, status: 'PASSED', score: 0.88 },
        { id: `s7-${Date.now()}`, verification_run_id: runId, step_name: 'RISK_ANALYSIS', step_order: 7, status: isReplay ? 'FAILED' : 'PASSED', score: overallConf },
        { id: `s8-${Date.now()}`, verification_run_id: runId, step_name: 'RECOMMENDATION', step_order: 8, status: 'PASSED', score: overallConf }
      ],
      risk_flags: isReplay ? [
        {
          id: `rf-${Date.now()}`,
          verification_run_id: runId,
          flag_code: 'DUPLICATE_REPLAY_DETECTED',
          severity: 'CRITICAL',
          description: 'Zero physical variance between before and after frames.',
          created_at: new Date().toISOString()
        }
      ] : []
    };

    const updatedRuns = [newRun, ...verificationRuns];
    setVerificationRuns(updatedRuns);
    saveToStorage('ground0_verifications', updatedRuns);

    // Update work order status
    const updatedWOs = workOrders.map(wo => {
      if (wo.id === workOrderId) {
        return {
          ...wo,
          status: isReplay ? 'REJECTED' : 'UNDER_INSPECTION' as any,
          updated_at: new Date().toISOString()
        };
      }
      return wo;
    });
    setWorkOrders(updatedWOs);
    saveToStorage('ground0_work_orders', updatedWOs);

    return newRun;
  };

  const conductHumanReview = async (
    verificationRunId: string,
    workOrderId: string,
    decision: HumanReviewDecision,
    notes: string
  ): Promise<void> => {
    // Update work order
    const targetStatus = decision === 'APPROVE' ? 'APPROVED' : decision === 'REJECT' ? 'REJECTED' : 'UNDER_INSPECTION';
    const updatedWOs = workOrders.map(wo => {
      if (wo.id === workOrderId) {
        return { ...wo, status: targetStatus as any, updated_at: new Date().toISOString() };
      }
      return wo;
    });
    setWorkOrders(updatedWOs);
    saveToStorage('ground0_work_orders', updatedWOs);

    // Also update associated complaints
    if (decision === 'APPROVE') {
      const updatedComps = complaints.map(c => {
        return { ...c, status: 'RESOLVED' as any, updated_at: new Date().toISOString() };
      });
      setComplaints(updatedComps);
      saveToStorage('ground0_complaints', updatedComps);
    }

    // Add audit event
    const audit: AuditEvent = {
      id: `aud-${Date.now()}`,
      action: `INSPECTOR_${decision}`,
      resource_type: 'work_order',
      resource_id: workOrderId,
      details: { decision, notes },
      created_at: new Date().toISOString()
    };
    setAuditEvents([audit, ...auditEvents]);
  };

  const submitCitizenFeedback = async (
    complaintId: string,
    isSolved: boolean,
    feedbackNotes: string
  ): Promise<void> => {
    const updatedComps = complaints.map(c => {
      if (c.id === complaintId) {
        return {
          ...c,
          status: isSolved ? 'RESOLVED' : 'REOPENED' as any,
          updated_at: new Date().toISOString()
        };
      }
      return c;
    });
    setComplaints(updatedComps);
    saveToStorage('ground0_complaints', updatedComps);

    const audit: AuditEvent = {
      id: `aud-${Date.now()}`,
      action: isSolved ? 'CITIZEN_CONFIRMED_RESOLVED' : 'CITIZEN_REOPENED_ISSUE',
      resource_type: 'complaint',
      resource_id: complaintId,
      details: { isSolved, feedbackNotes },
      created_at: new Date().toISOString()
    };
    setAuditEvents([audit, ...auditEvents]);
  };

  const toggleCameraPrivacy = (cameraId: string) => {
    setCameras(cameras.map(c => {
      if (c.id === cameraId) {
        return { ...c, privacy_blur_enabled: !c.privacy_blur_enabled };
      }
      return c;
    }));
  };

  return (
    <DataContext.Provider value={{
      role,
      setRole,
      complaints,
      masterIssues,
      workOrders,
      verificationRuns,
      cameras,
      sustainability,
      auditEvents,
      submitComplaint,
      createWorkOrder,
      submitEvidenceAndVerify,
      conductHumanReview,
      submitCitizenFeedback,
      toggleCameraPrivacy
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
