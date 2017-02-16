/**
 * 
 */
package com.anthem.oss.nimbus.core.bpm.activiti;

import org.activiti.engine.TaskService;
import org.activiti.engine.delegate.DelegateExecution;
import org.activiti.engine.delegate.ExecutionListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.anthem.nimbus.platform.spec.model.dsl.binder.AssignmentTask;
import com.anthem.oss.nimbus.core.domain.model.state.QuadModel;
import com.anthem.oss.nimbus.core.session.UserEndpointSession;

/**
 * @author Jayant Chaudhuri
 *
 */
@Component
public class TaskCompletionListener implements ExecutionListener {

	private static final long serialVersionUID = 1L;
	
	@Autowired
	TaskService taskService;

	@Override
	public void notify(DelegateExecution execution) {
		ActivitiContext aCtx = (ActivitiContext) execution.getVariable(ActivitiGateway.PROCESS_ENGINE_GTWY_KEY);
		
		QuadModel<?,?> quadModel = UserEndpointSession.getOrThrowEx(aCtx.getProcessEngineContext().getCommandMsg().getCommand());
		
		AssignmentTask assignmentTask = (AssignmentTask)quadModel.getCore().getState();
		String taskId = assignmentTask.getTaskId();
		taskService.complete(taskId);
    }

}